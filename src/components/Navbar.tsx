import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, LogOut, Globe, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  
  // Only show navigation links on home page
  const isHomePage = location.pathname === '/';
  const isChatPage = location.pathname === '/chat';
  
  const navLinks = [
    { name: t('home'), path: "/" },
    { name: "Features", path: "/#features" },
    { name: t('pricing'), path: "/pricing" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">psicolog.ia</span>
          </div>
        </Link>

        {isHomePage && (
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}

        {isChatPage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">
              {language === 'es' ? 'Dashboard' : 'Dashboard'}
            </span>
          </Button>
        )}

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Globe className="mr-2 h-4 w-4" />
                {language.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background z-50">
              <DropdownMenuItem 
                onClick={() => setLanguage('es')}
                className="cursor-pointer"
              >
                🇪🇸 Español
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage('en')}
                className="cursor-pointer"
              >
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline truncate max-w-[200px]">
                {user.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('logout')}</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth?mode=login">{t('login')}</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/auth">{t('auth_signup')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
