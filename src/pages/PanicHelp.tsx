import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import { GUIDED_VIDEOS } from "@/config/guidedVideos";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PanicHelp() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "es" ? "es" : "en";
  const videoSrc = GUIDED_VIDEOS.panic[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-zinc-900 dark:to-zinc-950">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('dashboard_back')}
          </Button>

          <div className="bg-background rounded-2xl shadow-xl p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {lang === "es" ? "Te acompaño en este momento" : "I'm here with you"}
              </h1>
              
              <p className="text-muted-foreground">
                {lang === "es"
                  ? "Este video está pensado para ayudarte a regular la respiración y bajar la intensidad del momento."
                  : "This video is designed to help you breathe, ground yourself, and soften this moment."}
              </p>
            </div>

            <CustomVideoPlayer src={videoSrc} />

            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">
                {lang === "es"
                  ? "⚠️ Este no es un servicio de emergencia. Si los síntomas son muy intensos o empeoran, buscá ayuda profesional o servicios de emergencia en tu país."
                  : "⚠️ This is not an emergency service. If symptoms feel very intense or get worse, please reach out to local emergency or professional help."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
