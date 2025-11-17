import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { Sparkles, Lock } from "lucide-react";

type UpgradeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: "panic" | "meditation";
};

export function UpgradeModal({ open, onOpenChange, feature }: UpgradeModalProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = language === "es" ? "es" : "en";

  const content = {
    panic: {
      title: {
        en: "Daily limit reached",
        es: "Límite diario alcanzado"
      },
      description: {
        en: "You've used your 2 free panic help sessions today. Upgrade to Premium for unlimited access whenever you need support.",
        es: "Has usado tus 2 sesiones gratuitas de ayuda contra el pánico hoy. Actualiza a Premium para acceso ilimitado cuando lo necesites."
      }
    },
    meditation: {
      title: {
        en: "Daily limit reached",
        es: "Límite diario alcanzado"
      },
      description: {
        en: "You've used your 2 free meditation sessions today. Upgrade to Premium for unlimited guided meditations.",
        es: "Has usado tus 2 sesiones gratuitas de meditación hoy. Actualiza a Premium para meditaciones guiadas ilimitadas."
      }
    }
  };

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate('/pricing');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-4">
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            {content[feature].title[lang]}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {content[feature].description[lang]}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">
              {lang === "es" ? "Premium incluye:" : "Premium includes:"}
            </span>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground ml-6">
            <li>
              {lang === "es" 
                ? "✓ Sesiones ilimitadas de pánico y meditación" 
                : "✓ Unlimited panic & meditation sessions"}
            </li>
            <li>
              {lang === "es" 
                ? "✓ Controles completos de tono y estado de ánimo" 
                : "✓ Full tone and mood controls"}
            </li>
            <li>
              {lang === "es" 
                ? "✓ Memoria a largo plazo en el chat" 
                : "✓ Long-term memory in chat"}
            </li>
            <li>
              {lang === "es" 
                ? "✓ Acceso anticipado a nuevas funciones" 
                : "✓ Early access to new features"}
            </li>
          </ul>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            {lang === "es" ? "Ahora no" : "Not now"}
          </Button>
          <Button
            onClick={handleUpgrade}
            className="flex-1"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {lang === "es" ? "Ver planes" : "View plans"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
