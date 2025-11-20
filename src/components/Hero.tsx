import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HowItWorks } from "@/components/HowItWorks";
import { useLanguage } from "@/hooks/useLanguage";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-muted to-background dark:from-zinc-900 dark:to-zinc-950 py-20 md:py-32">
        <BackgroundPaths />
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

            <div className="relative h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5">
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                size={300}
              />
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-background dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <HowItWorks />
        </div>
      </section>
    </>
  );
};
