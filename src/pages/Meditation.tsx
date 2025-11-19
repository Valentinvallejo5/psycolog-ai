import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import { GUIDED_VIDEOS } from "@/config/guidedVideos";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Meditation() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const lang = language === "es" ? "es" : "en";
  const videoSrc = GUIDED_VIDEOS.meditation[lang];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
                {lang === "es" ? "Meditación guiada" : "Guided meditation"}
              </h1>
              
              <p className="text-muted-foreground">
                {lang === "es"
                  ? "Tomate estos 5 minutos para respirar, relajar el cuerpo y volver al presente."
                  : "Take these 5 minutes to breathe, soften your body, and come back to the present moment."}
              </p>
            </div>

            <CustomVideoPlayer src={videoSrc} />

            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">
                {lang === "es"
                  ? "💜 Cuando termines, tómate un momento para notar cómo te sientes."
                  : "💜 When you finish, take a moment to notice how you feel."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
