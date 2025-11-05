import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { authSchema, signupSchema, type AuthFormData } from "@/lib/validations";
import { useTranslation, type Language } from "@/lib/i18n";
import heroRobot from "@/assets/hero-robot.png";
import { Globe, Brain, Check, X } from "lucide-react";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') === 'login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('es');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const t = useTranslation(language);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  // Real-time password match validation
  useEffect(() => {
    if (!isLogin && confirmPassword.length > 0) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(null);
    }
  }, [password, confirmPassword, isLogin]);

  const validateForm = (): boolean => {
    try {
      if (isLogin) {
        authSchema.parse({ email, password });
      } else {
        signupSchema.parse({ email, password, confirmPassword });
      }
      return true;
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || t('error_auth');
      toast({
        title: "Error",
        description: t(errorMessage as keyof typeof import("@/lib/i18n").translations.es),
        variant: "destructive",
      });
      return false;
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: t('success_login'),
        });
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              language_preference: language
            }
          }
        });
        
        if (error) throw error;
        
        toast({
          title: t('success_signup'),
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || t('error_auth'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || t('error_auth'),
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 relative">
        {/* Language Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          className="absolute top-4 right-4"
        >
          <Globe className="h-5 w-5" />
          <span className="ml-2 text-sm">{language.toUpperCase()}</span>
        </Button>

        <Card className="w-full max-w-md p-8 space-y-6">
          {/* Logo and Brand */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">psicolog.ia</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-muted-foreground">{t('auth_subtitle')}</p>
          </div>

          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full" 
              size="lg"
              onClick={handleGoogleAuth}
              disabled={loading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('auth_continue_google')}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <Label htmlFor="email">{t('auth_email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'es' ? 'tu@ejemplo.com' : 'you@example.com'}
                  required
                  disabled={loading}
                  maxLength={255}
                />
              </div>
              <div>
                <Label htmlFor="password">{t('auth_password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  maxLength={128}
                />
              </div>

              {!isLogin && (
                <div className="relative">
                  <Label htmlFor="confirmPassword">{t('auth_confirm_password')}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={loading}
                      maxLength={128}
                      className={
                        passwordsMatch === null ? '' :
                        passwordsMatch ? 'border-green-500 pr-10' : 
                        'border-red-500 pr-10'
                      }
                    />
                    {passwordsMatch !== null && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {passwordsMatch ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {passwordsMatch === false && (
                    <p className="text-sm text-red-500 mt-1">
                      {t('auth_passwords_no_match')}
                    </p>
                  )}
                </div>
              )}

              <Button className="w-full" size="lg" type="submit" disabled={loading}>
                {loading ? "..." : isLogin ? t('auth_login') : t('auth_signup')}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? t('auth_need_account') : t('auth_have_account')}{" "}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setConfirmPassword("");
                  setPasswordsMatch(null);
                }}
                className="text-primary hover:underline"
                disabled={loading}
              >
                {t('auth_click_here')}
              </button>
            </p>
          </div>
        </Card>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 p-12">
        <img
          src={heroRobot}
          alt="Supportive AI Assistant"
          className="max-w-md w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Auth;
