import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HowItWorks } from "@/components/HowItWorks";
import { useLanguage } from "@/hooks/useLanguage";

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {t('hero_main_title')}{" "}
              <span className="text-primary">{t('hero_main_highlight')}</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              {t('hero_main_subtitle')}
            </p>
            <Button variant="hero" size="lg" asChild className="text-base">
              <Link to="/auth">{t('cta_start_trial')}</Link>
            </Button>
          </div>

          <div className="relative">
            <HowItWorks />
          </div>
        </div>
      </div>
    </section>
  );
};
