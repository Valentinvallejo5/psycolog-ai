import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Send, User, Bot, Menu, X, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { askAI } from "@/lib/aiClient";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { Navbar } from "@/components/Navbar";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("friendly");
  const [mood, setMood] = useState("neutral");
  const [interaction, setInteraction] = useState("advise");
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
        setTone(prefs.tone as string || "friendly");
        setMood(prefs.mood as string || "neutral");
        setInteraction(prefs.interaction as string || "advise");
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
      tone: tone,
      mood: mood,
      interaction: interaction
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
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
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
              <ToggleGroup type="single" value={tone} onValueChange={(value) => value && setTone(value)}>
                <ToggleGroupItem value="friendly" className="flex-1">
                  {t('tone_friendly')}
                </ToggleGroupItem>
                <ToggleGroupItem value="professional" className="flex-1">
                  {t('tone_professional')}
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-xs text-muted-foreground">{t('tone_desc')}</p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('chat_mood')}</Label>
              <ToggleGroup type="single" value={mood} onValueChange={(value) => value && setMood(value)} className="grid grid-cols-3 gap-2">
                <ToggleGroupItem value="calm" className="text-sm">
                  {t('mood_calm')}
                </ToggleGroupItem>
                <ToggleGroupItem value="neutral" className="text-sm">
                  {t('mood_neutral')}
                </ToggleGroupItem>
                <ToggleGroupItem value="hopeful" className="text-sm">
                  {t('mood_hopeful')}
                </ToggleGroupItem>
                <ToggleGroupItem value="tired" className="text-sm">
                  {t('mood_tired')}
                </ToggleGroupItem>
                <ToggleGroupItem value="anxious" className="text-sm">
                  {t('mood_anxious')}
                </ToggleGroupItem>
                <ToggleGroupItem value="sad" className="text-sm">
                  {t('mood_sad')}
                </ToggleGroupItem>
                <ToggleGroupItem value="angry" className="text-sm">
                  {t('mood_angry')}
                </ToggleGroupItem>
                <ToggleGroupItem value="overwhelmed" className="text-sm">
                  {t('mood_overwhelmed')}
                </ToggleGroupItem>
                <ToggleGroupItem value="lonely" className="text-sm">
                  {t('mood_lonely')}
                </ToggleGroupItem>
                <ToggleGroupItem value="unsure" className="text-sm col-span-3">
                  {t('mood_unsure')}
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-xs text-muted-foreground">{t('mood_desc')}</p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('chat_interaction')}</Label>
              <ToggleGroup type="single" value={interaction} onValueChange={(value) => value && setInteraction(value)}>
                <ToggleGroupItem value="advise" className="flex-1">
                  {t('interaction_advise')}
                </ToggleGroupItem>
                <ToggleGroupItem value="listen" className="flex-1">
                  {t('interaction_listen')}
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-xs text-muted-foreground">{t('interaction_desc')}</p>
            </div>

            {/* Back to Dashboard Button */}
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4" />
                {language === 'es' ? 'Volver al Dashboard' : 'Back to Dashboard'}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Sidebar toggle for mobile */}
        {!sidebarOpen && (
          <div className="h-14 border-b border-border bg-card flex items-center px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        )}

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
    </div>
  );
};

export default Chat;
