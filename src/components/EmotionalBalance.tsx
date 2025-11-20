import { Shield, Wind, Sparkles, Smartphone } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Typewriter } from '@/components/ui/typewriter-text';

export const EmotionalBalance = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Shield,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      title: t('benefit_privacy_title'),
      description: t('benefit_privacy_desc'),
    },
    {
      icon: Wind,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      title: t('benefit_panic_title'),
      description: t('benefit_panic_desc'),
    },
    {
      icon: Sparkles,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      title: t('benefit_meditation_title'),
      description: t('benefit_meditation_desc'),
    },
    {
      icon: Smartphone,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      title: t('benefit_device_title'),
      description: t('benefit_device_desc'),
    },
  ];

  return (
    <section className="py-20 bg-background dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground dark:text-white">
            <Typewriter 
              text={t('emotional_balance_title')}
              speed={50}
              cursor=""
              className="inline"
            />
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-300">
            {t('emotional_balance_subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex gap-6 p-6 rounded-lg hover:bg-muted/50 dark:hover:bg-zinc-800/50 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-full ${benefit.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${benefit.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
