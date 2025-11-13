import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/hooks/useLanguage';
import chatIllustration from '@/assets/chat-illustration.png';
import panicIllustration from '@/assets/panic-illustration.png';
import meditationIllustration from '@/assets/meditation-illustration.png';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLockedFeature = () => {
    toast({
      title: t('dashboard_unavailable'),
      description: "Esta característica estará disponible próximamente.",
    });
  };

  const features = [
    {
      id: 'chat',
      title: t('dashboard_chat_title'),
      description: t('dashboard_chat_desc'),
      image: chatIllustration,
      buttonText: 'Start Chatting',
      available: true,
      action: () => navigate('/chat'),
    },
    {
      id: 'panic',
      title: t('dashboard_panic_title'),
      description: t('dashboard_panic_desc'),
      image: panicIllustration,
      buttonText: 'Get Help Now',
      available: false,
      action: handleLockedFeature,
    },
    {
      id: 'meditation',
      title: t('dashboard_meditation_title'),
      description: t('dashboard_meditation_desc'),
      image: meditationIllustration,
      buttonText: 'Begin Meditation',
      available: false,
      action: handleLockedFeature,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Navbar />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              {t('dashboard_welcome')}, {user?.email?.split('@')[0]}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('dashboard_ready')}
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {features.map((feature) => {
              return (
                <Card 
                  key={feature.id} 
                  className={`relative transition-all hover:shadow-lg ${
                    !feature.available ? 'opacity-75' : ''
                  }`}
                >
                  <CardHeader className="space-y-4">
                    <div className="w-32 h-32 mx-auto relative">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-contain"
                      />
                      {!feature.available && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                          <Lock className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-center">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-center min-h-[48px]">
                      {feature.description}
                    </CardDescription>
                    <Button 
                      className="w-full"
                      onClick={feature.action}
                      disabled={!feature.available}
                      variant={feature.available ? "default" : "outline"}
                    >
                      {!feature.available && <Lock className="h-4 w-4 mr-2" />}
                      {feature.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
