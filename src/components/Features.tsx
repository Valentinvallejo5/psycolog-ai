import { Clock, Lock, User, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

export const Features = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Clock,
      title: t('feature_availability'),
      description: t('feature_availability_desc'),
    },
    {
      icon: Lock,
      title: t('feature_confidentiality'),
      description: t('feature_confidentiality_desc'),
    },
    {
      icon: User,
      title: t('feature_personalization'),
      description: t('feature_personalization_desc'),
    },
    {
      icon: Heart,
      title: t('feature_wellbeing'),
      description: t('feature_wellbeing_desc'),
    },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('features_main_title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features_main_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border bg-gradient-to-b from-card to-muted hover:shadow-[var(--shadow-soft)] transition-[var(--transition-smooth)]"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
