import { Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">psicolog.ia</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer_tagline')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer_legal')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/terms" className="hover:text-foreground transition-colors">{t('footer_terms')}</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">{t('footer_privacy')}</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors">{t('footer_contact')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer_connect')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
          © {new Date().getFullYear()} psicolog.ia. {t('footer_rights')}
        </div>
      </div>
    </footer>
  );
};
