import { AdvancedButton } from "@/components/ui/gradient-button";
import { Link } from "react-router-dom";
import { HowItWorks } from "@/components/HowItWorks";
import { useLanguage } from "@/hooks/useLanguage";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { motion } from "framer-motion";
import { Typewriter } from "@/components/ui/typewriter-text";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";
import { getUserDisplayName } from "@/lib/chatHelpers";

export const Hero = () => {
  const { user, loading } = useAuth();
  const { language, t } = useLanguage();

  const archieMessage = useMemo(() => {
    if (loading) return '';
    
    if (!user) {
      // Usuario NO logueado: frase fija
      return t('archie_greeting_guest');
    }
    
    // Usuario logueado: frase aleatoria personalizada
    const userName = getUserDisplayName(user);
    const greetings = [
      t('archie_greeting_user_1'),
      t('archie_greeting_user_2'),
      t('archie_greeting_user_3'),
      t('archie_greeting_user_4'),
      t('archie_greeting_user_5'),
    ];
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex].replace('{{user}}', userName);
  }, [user, loading, language, t]);

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
              <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-300 max-w-xl">
                <Typewriter 
                  text={t('hero_main_subtitle')}
                  speed={50}
                  cursor=""
                  className="inline"
                />
              </p>
              <AdvancedButton onClick={() => window.location.href = '/auth'}>
                {t('cta_start_trial')}
              </AdvancedButton>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[500px] rounded-lg"
            >
              {/* Burbuja de diálogo de Archie */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="
                  absolute z-10
                  max-md:top-full max-md:mt-4 max-md:left-1/2 max-md:-translate-x-1/2 max-md:w-[90%]
                  md:left-full md:ml-6 md:top-[100px] md:w-[320px]
                  bg-[#b18dfc]/90 text-white backdrop-blur-md
                  border border-white/20
                  rounded-2xl p-4 shadow-2xl
                  transition-all duration-500 ease-in-out
                "
              >
                <TypingAnimation 
                  key={archieMessage || 'archie-fallback'}
                  text={archieMessage || 'Hola, soy Archie, tu mental coach. Estoy acá para acompañarte.'}
                  duration={60}
                  className="text-sm md:text-base font-medium leading-relaxed"
                />
              </motion.div>
 
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                size={300}
              />
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </motion.div>
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
