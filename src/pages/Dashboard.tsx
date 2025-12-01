import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, MessageCircle, HeartPulse, Flower2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/hooks/useLanguage';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import robotWaving from '@/assets/robot-waving.png';
import robotPanic from '@/assets/robot-panic.png';
import robotMeditation from '@/assets/robot-meditation.png';
import { AdvancedButton } from '@/components/ui/gradient-button';
import { MetalButton } from '@/components/ui/liquid-glass-button';

type UsageData = {
  panic_count: number;
  meditation_count: number;
  plan: 'free' | 'monthly' | 'annual';
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; feature: 'panic' | 'meditation' | null }>({
    open: false,
    feature: null
  });
  const [usageData, setUsageData] = useState<UsageData>({
    panic_count: 0,
    meditation_count: 0,
    plan: 'free'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageData();
  }, [user]);

  const fetchUsageData = async () => {
    if (!user) return;

    try {
      // Get user's subscription plan
      const { data: subscription } = await supabase
        .from('subscription_plans')
        .select('plan')
        .eq('user_id', user.id)
        .single();

      const plan = subscription?.plan || 'free';
      const today = new Date().toISOString().split('T')[0];

      // Get today's usage
      const { data: usage } = await supabase
        .from('daily_usage')
        .select('panic_sessions_count, meditation_sessions_count')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      setUsageData({
        panic_count: usage?.panic_sessions_count || 0,
        meditation_count: usage?.meditation_sessions_count || 0,
        plan: plan as 'free' | 'monthly' | 'annual'
      });
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePanicClick = async () => {
    if (usageData.plan === 'free' && usageData.panic_count >= 2) {
      setUpgradeModal({ open: true, feature: 'panic' });
      return;
    }

    try {
      const response = await supabase.functions.invoke('start-panic-session');

      if (response.data?.allowed) {
        navigate('/panic');
      } else if (response.data?.reason === 'limit_reached') {
        setUpgradeModal({ open: true, feature: 'panic' });
      } else {
        toast({
          title: 'Error',
          description: 'Could not start panic session. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error starting panic session:', error);
      toast({
        title: 'Error',
        description: 'Could not start panic session. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleMeditationClick = async () => {
    if (usageData.plan === 'free' && usageData.meditation_count >= 2) {
      setUpgradeModal({ open: true, feature: 'meditation' });
      return;
    }

    try {
      const response = await supabase.functions.invoke('start-meditation-session');

      if (response.data?.allowed) {
        navigate('/meditation');
      } else if (response.data?.reason === 'limit_reached') {
        setUpgradeModal({ open: true, feature: 'meditation' });
      } else {
        toast({
          title: 'Error',
          description: 'Could not start meditation session. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error starting meditation session:', error);
      toast({
        title: 'Error',
        description: 'Could not start meditation session. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const isPremium = usageData.plan === 'monthly' || usageData.plan === 'annual';
  const panicLimitReached = !isPremium && usageData.panic_count >= 2;
  const meditationLimitReached = !isPremium && usageData.meditation_count >= 2;

  const features = [
    {
      id: 'chat',
      title: t('dashboard_chat_title'),
      description: t('dashboard_chat_desc'),
      image: robotWaving,
      icon: MessageCircle,
      buttonText: t('dashboard_start_chat'),
      available: true,
      action: () => navigate('/chat'),
    },
    {
      id: 'panic',
      title: t('dashboard_panic_title'),
      description: t('dashboard_panic_desc'),
      image: robotPanic,
      icon: HeartPulse,
      buttonText: panicLimitReached ? t('dashboard_upgrade_unlock') : t('dashboard_get_help'),
      available: true,
      action: handlePanicClick,
      usageInfo: !isPremium ? `${usageData.panic_count}/2 ${t('dashboard_sessions_used')}` : undefined,
      locked: panicLimitReached
    },
    {
      id: 'meditation',
      title: t('dashboard_meditation_title'),
      description: t('dashboard_meditation_desc'),
      image: robotMeditation,
      icon: Flower2,
      buttonText: meditationLimitReached ? t('dashboard_upgrade_unlock') : t('dashboard_begin_meditation'),
      available: true,
      action: handleMeditationClick,
      usageInfo: !isPremium ? `${usageData.meditation_count}/2 ${t('dashboard_sessions_used')}` : undefined,
      locked: meditationLimitReached
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-zinc-900 dark:to-zinc-950">
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
            {!isPremium && (
              <Badge variant="secondary" className="mt-2">
                Free Plan
              </Badge>
            )}
            {isPremium && (
              <Badge variant="default" className="mt-2">
                Premium
              </Badge>
            )}
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.id} 
                  className={`relative transition-all hover:shadow-lg ${
                    feature.locked ? 'opacity-75' : ''
                  }`}
                >
                  <CardHeader className="space-y-4">
                    <div className="w-48 mx-auto relative p-4 rounded-3xl bg-gradient-to-br from-[#C9A6FF]/30 to-[#E8D9FF]/20 backdrop-blur-sm shadow-lg shadow-[#C9A6FF]/20 flex items-center justify-center">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-auto object-contain"
                      />
                      {feature.locked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-3xl">
                          <Lock className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-center">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col space-y-4 h-full">
                    <CardDescription className="text-center min-h-[48px]">
                      {feature.description}
                    </CardDescription>
                    <div className="text-center min-h-[24px]">
                      {feature.usageInfo && (
                        <Badge variant={feature.locked ? "destructive" : "secondary"} className="text-xs">
                          {feature.usageInfo}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-auto">
                      {feature.locked ? (
                        <MetalButton 
                          className="w-full"
                          onClick={feature.action}
                          disabled={loading}
                          variant="primary"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <Lock className="h-4 w-4" />
                            {feature.buttonText}
                          </span>
                        </MetalButton>
                      ) : (
                        <AdvancedButton 
                          className="w-full"
                          onClick={feature.action}
                          disabled={loading}
                        >
                          {feature.buttonText}
                        </AdvancedButton>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <UpgradeModal
        open={upgradeModal.open}
        onOpenChange={(open) => setUpgradeModal({ open, feature: null })}
        feature={upgradeModal.feature || 'panic'}
      />
    </div>
  );
}
