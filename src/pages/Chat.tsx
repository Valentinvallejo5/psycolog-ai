import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Send, User, Bot, Menu, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { askAI } from "@/lib/aiClient";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [language] = useState<'es' | 'en'>('es');
  const t = useTranslation(language);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [tone, setTone] = useState([50]);
  const [mood, setMood] = useState([50]);
  const [interaction, setInteraction] = useState([50]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const saveTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      const { data: prefs } = await supabase
        .from('slider_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (prefs) {
        setTone([prefs.tone]);
        setMood([prefs.mood]);
        setInteraction([prefs.interaction]);
      }

      const { data: msgs } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(20);
      
      if (msgs && msgs.length > 0) {
        setMessages(msgs.map((m, i) => ({
          id: i + 1,
          role: m.role as 'user' | 'assistant',
          content: m.content
        })));
      } else {
        setMessages([{
          id: 1,
          role: "assistant",
          content: language === 'es' 
            ? "¡Hola! ¿Cómo puedo asistirte hoy?" 
            : "Hello! How can I assist you today?"
        }]);
      }
    };
    
    loadData();
  }, [user, language]);

  const savePreferences = async () => {
    if (!user) return;
    
    await supabase.from('slider_preferences').upsert({
      user_id: user.id,
      tone: tone[0],
      mood: mood[0],
      interaction: interaction[0]
    });
  };

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    
    saveTimeout.current = setTimeout(() => {
      savePreferences();
    }, 1000);
  }, [tone, mood, interaction]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const { text, limitReached } = await askAI([
        ...conversationHistory,
        { role: 'user', content: userMessage.content }
      ]);

      const aiMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: text,
      };
      
      setMessages((prev) => [...prev, aiMessage]);

      if (limitReached) {
        toast({
          title: t('error_limit'),
          description: "Upgrade to continue chatting.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      if (error.message === 'RATE_LIMIT') {
        toast({
          title: t('error_rate'),
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to get response. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } border-r border-border bg-card transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('chat_tone')}</Label>
              <Slider
                value={tone}
                onValueChange={setTone}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('tone_friendly')}</span>
                <span>{t('tone_professional')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('chat_mood')}</Label>
              <Slider
                value={mood}
                onValueChange={setMood}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('mood_bad')}</span>
                <span>{t('mood_good')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('chat_interaction')}</Label>
              <Slider
                value={interaction}
                onValueChange={setInteraction}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('interaction_listen')}</span>
                <span>{t('interaction_advise')}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center px-6 gap-4">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-xl font-semibold">psicolog.ia</h1>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              <Card
                className={`max-w-2xl p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                <p>{message.content}</p>
              </Card>
              {message.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <Card className="p-4 bg-card">
                <p className="text-muted-foreground">
                  {language === 'es' ? 'Escribiendo...' : 'Typing...'}
                </p>
              </Card>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card p-6">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder={t('chat_placeholder')}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSend} size="icon" variant="hero" disabled={isLoading}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
