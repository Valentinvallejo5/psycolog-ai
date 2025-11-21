import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeClosed, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

const Auth = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // For 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(isLogin ? 'Por favor ingresa tu correo y contraseña' : 'Por favor completa todos los campos');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success('¡Bienvenido de vuelta!');
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (error) throw error;
        toast.success('¡Cuenta creada exitosamente!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Ocurrió un error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión con Google');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-background dark:bg-black relative overflow-hidden flex items-center justify-center">
      {/* Background gradient effect - purple malva colors */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C9A6FF]/20 via-[#E8D5FF]/30 to-[#F5F0FF] dark:from-[#C9A6FF]/40 dark:via-[#B39DDB]/50 dark:to-black" />
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* Top radial glow - malva colors */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#C9A6FF]/30 dark:bg-[#C9A6FF]/20 blur-[80px]" />
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-[#B39DDB]/30 dark:bg-[#B39DDB]/20 blur-[60px]"
        animate={{ 
          opacity: [0.15, 0.3, 0.15],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "mirror"
        }}
      />
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-[#C9A6FF]/30 dark:bg-[#C9A6FF]/20 blur-[60px]"
        animate={{ 
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1
        }}
      />

      {/* Animated glow spots */}
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-[#C9A6FF]/10 dark:bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-[#B39DDB]/10 dark:bg-white/5 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <div className="relative">
          <div className="relative group">
            {/* Card glow effect */}
            <motion.div 
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
              animate={{
                boxShadow: [
                  "0 0 10px 2px rgba(255,255,255,0.03)",
                  "0 0 15px 5px rgba(255,255,255,0.05)",
                  "0 0 10px 2px rgba(255,255,255,0.03)"
                ],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut", 
                repeatType: "mirror" 
              }}
            />

            {/* Traveling light beam effect */}
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-[#C9A6FF] dark:via-white to-transparent opacity-70"
                initial={{ filter: "blur(2px)" }}
                animate={{ 
                  left: ["-50%", "100%"],
                  opacity: [0.3, 0.7, 0.3],
                  filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                }}
                transition={{ 
                  left: {
                    duration: 2.5, 
                    ease: "easeInOut", 
                    repeat: Infinity,
                    repeatDelay: 1
                  },
                  opacity: {
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "mirror"
                  },
                  filter: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "mirror"
                  }
                }}
              />
              
              <motion.div 
                className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-[#C9A6FF] dark:via-white to-transparent opacity-70"
                initial={{ filter: "blur(2px)" }}
                animate={{ 
                  top: ["-50%", "100%"],
                  opacity: [0.3, 0.7, 0.3],
                  filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                }}
                transition={{ 
                  top: {
                    duration: 2.5, 
                    ease: "easeInOut", 
                    repeat: Infinity,
                    repeatDelay: 1,
                    delay: 0.6
                  },
                  opacity: {
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.6
                  },
                  filter: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 0.6
                  }
                }}
              />
              
              <motion.div 
                className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-[#C9A6FF] dark:via-white to-transparent opacity-70"
                initial={{ filter: "blur(2px)" }}
                animate={{ 
                  right: ["-50%", "100%"],
                  opacity: [0.3, 0.7, 0.3],
                  filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                }}
                transition={{ 
                  right: {
                    duration: 2.5, 
                    ease: "easeInOut", 
                    repeat: Infinity,
                    repeatDelay: 1,
                    delay: 1.2
                  },
                  opacity: {
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1.2
                  },
                  filter: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1.2
                  }
                }}
              />
              
              <motion.div 
                className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-[#C9A6FF] dark:via-white to-transparent opacity-70"
                initial={{ filter: "blur(2px)" }}
                animate={{ 
                  bottom: ["-50%", "100%"],
                  opacity: [0.3, 0.7, 0.3],
                  filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                }}
                transition={{ 
                  bottom: {
                    duration: 2.5, 
                    ease: "easeInOut", 
                    repeat: Infinity,
                    repeatDelay: 1,
                    delay: 1.8
                  },
                  opacity: {
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1.8
                  },
                  filter: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1.8
                  }
                }}
              />
              
              {/* Corner glow spots */}
              <motion.div 
                className="absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-[#C9A6FF]/40 dark:bg-white/40 blur-[1px]"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
              />
              <motion.div 
                className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full bg-[#C9A6FF]/60 dark:bg-white/60 blur-[2px]"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
              />
              <motion.div 
                className="absolute bottom-0 right-0 h-[8px] w-[8px] rounded-full bg-[#C9A6FF]/60 dark:bg-white/60 blur-[2px]"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", delay: 1 }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 h-[5px] w-[5px] rounded-full bg-[#C9A6FF]/40 dark:bg-white/40 blur-[1px]"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2.3, repeat: Infinity, repeatType: "mirror", delay: 1.5 }}
              />
            </div>

            {/* Card border glow */}
            <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-[#C9A6FF]/20 via-[#C9A6FF]/40 to-[#C9A6FF]/20 dark:from-white/3 dark:via-white/7 dark:to-white/3 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
            
            {/* Glass card background */}
            <div className="relative bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-[#C9A6FF]/20 dark:border-white/[0.05] shadow-2xl overflow-hidden">
              {/* Subtle card inner patterns */}
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]" 
                style={{
                  backgroundImage: `linear-gradient(135deg, hsl(var(--primary)) 0.5px, transparent 0.5px), linear-gradient(45deg, hsl(var(--primary)) 0.5px, transparent 0.5px)`,
                  backgroundSize: '30px 30px'
                }}
              />

              {/* Logo and header */}
              <div className="text-center space-y-1 mb-5">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mx-auto w-12 h-12 rounded-full border border-[#C9A6FF]/30 dark:border-white/10 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#C9A6FF]/20 to-[#B39DDB]/10 dark:from-transparent dark:to-transparent"
                >
                  <svg className="w-7 h-7 text-[#C9A6FF] dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A6FF]/20 dark:from-white/10 to-transparent opacity-50" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold"
                >
                  {isLogin ? (
                    <>
                      <span className="text-foreground dark:text-white">Bienvenido a </span>
                      <span className="text-[#C9A6FF]">psicolog.ia</span>
                    </>
                  ) : (
                    <>
                      <span className="text-foreground dark:text-white">Únete a </span>
                      <span className="text-[#C9A6FF]">psicolog.ia</span>
                    </>
                  )}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground dark:text-white/60 text-xs"
                >
                  {isLogin ? t('auth_subtitle') : 'Comienza tu viaje hacia el bienestar'}
                </motion.p>
              </div>

              {/* Login form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <motion.div className="space-y-3">
                  {/* Email input */}
                  <motion.div 
                    className={`relative ${focusedInput === "email" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Mail className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "email" ? 'text-[#C9A6FF] dark:text-white' : 'text-muted-foreground dark:text-white/40'
                      }`} />
                      
                      <Input
                        type="email"
                        placeholder={t('auth_email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-[#C9A6FF]/5 dark:bg-white/5 border-transparent focus:border-[#C9A6FF]/40 dark:focus:border-white/20 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-[#C9A6FF]/10 dark:focus:bg-white/10"
                      />
                      
                      {focusedInput === "email" && (
                        <motion.div 
                          layoutId="input-highlight"
                          className="absolute inset-0 bg-white/5 -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Password input */}
                  <motion.div 
                    className={`relative ${focusedInput === "password" ? 'z-10' : ''}`}
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    
                    <div className="relative flex items-center overflow-hidden rounded-lg">
                      <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                        focusedInput === "password" ? 'text-[#C9A6FF] dark:text-white' : 'text-muted-foreground dark:text-white/40'
                      }`} />
                      
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t('auth_password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full bg-[#C9A6FF]/5 dark:bg-white/5 border-transparent focus:border-[#C9A6FF]/40 dark:focus:border-white/20 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-[#C9A6FF]/10 dark:focus:bg-white/10"
                      />
                      
                      <div 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 cursor-pointer"
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4 text-muted-foreground dark:text-white/40 hover:text-[#C9A6FF] dark:hover:text-white transition-colors duration-300" />
                        ) : (
                          <EyeClosed className="w-4 h-4 text-muted-foreground dark:text-white/40 hover:text-[#C9A6FF] dark:hover:text-white transition-colors duration-300" />
                        )}
                      </div>
                      
                      {focusedInput === "password" && (
                        <motion.div 
                          layoutId="input-highlight"
                          className="absolute inset-0 bg-white/5 -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Confirm Password (only for signup) */}
                  {!isLogin && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`relative ${focusedInput === "confirm" ? 'z-10' : ''}`}
                      whileFocus={{ scale: 1.02 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      
                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${
                          focusedInput === "confirm" ? 'text-[#C9A6FF] dark:text-white' : 'text-muted-foreground dark:text-white/40'
                        }`} />
                        
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t('auth_confirm_password')}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onFocus={() => setFocusedInput("confirm")}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full bg-[#C9A6FF]/5 dark:bg-white/5 border-transparent focus:border-[#C9A6FF]/40 dark:focus:border-white/20 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-[#C9A6FF]/10 dark:focus:bg-white/10"
                        />
                        
                        {focusedInput === "confirm" && (
                          <motion.div 
                            layoutId="input-highlight"
                            className="absolute inset-0 bg-white/5 -z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Remember me (only for login) */}
                {isLogin && (
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                          className="appearance-none h-4 w-4 rounded border border-[#C9A6FF]/40 dark:border-white/20 bg-[#C9A6FF]/5 dark:bg-white/5 checked:bg-[#C9A6FF] dark:checked:bg-white checked:border-[#C9A6FF] dark:checked:border-white focus:outline-none focus:ring-1 focus:ring-[#C9A6FF]/50 dark:focus:ring-white/30 transition-all duration-200"
                        />
                        {rememberMe && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center text-white dark:text-black pointer-events-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      <label htmlFor="remember-me" className="text-xs text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/80 transition-colors duration-200">
                        Recordarme
                      </label>
                    </div>
                  </div>
                )}

                {/* Sign in button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/button mt-5"
                >
                  <div className="absolute inset-0 bg-[#C9A6FF]/30 dark:bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                  
                  <div className="relative overflow-hidden bg-[#C9A6FF] dark:bg-white text-white dark:text-black font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -z-10"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ 
                        duration: 1.5, 
                        ease: "easeInOut", 
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      style={{ 
                        opacity: isLoading ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                    
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <div className="w-4 h-4 border-2 border-white/70 dark:border-black/70 border-t-transparent rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span
                          key="button-text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          {isLogin ? t('auth_login') : t('auth_signup')}
                          <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>

                {/* Divider */}
                <div className="relative mt-2 mb-5 flex items-center">
                  <div className="flex-grow border-t border-[#C9A6FF]/20 dark:border-white/5"></div>
                  <motion.span 
                    className="mx-3 text-xs text-muted-foreground dark:text-white/40"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: [0.7, 0.9, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    o
                  </motion.span>
                  <div className="flex-grow border-t border-[#C9A6FF]/20 dark:border-white/5"></div>
                </div>

                {/* Google Sign In */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full relative group/google"
                >
                  <div className="absolute inset-0 bg-[#C9A6FF]/20 dark:bg-white/5 rounded-lg blur opacity-0 group-hover/google:opacity-70 transition-opacity duration-300" />
                  
                  <div className="relative overflow-hidden bg-[#C9A6FF]/10 dark:bg-white/5 text-foreground dark:text-white font-medium h-10 rounded-lg border border-[#C9A6FF]/30 dark:border-white/10 hover:border-[#C9A6FF]/50 dark:hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                      <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                      <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                      <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                    </svg>
                    
                    <span className="text-foreground/80 dark:text-white/80 group-hover/google:text-foreground dark:group-hover/google:text-white transition-colors text-xs">
                      {t('auth_continue_google')}
                    </span>
                    
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A6FF]/10 dark:via-white/5 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>
                </motion.button>

                {/* Toggle login/signup */}
                <motion.p 
                  className="text-center text-xs text-muted-foreground dark:text-white/60 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {isLogin ? t('auth_need_account') : t('auth_have_account')}{' '}
                  <button 
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="relative inline-block group/signup"
                  >
                    <span className="relative z-10 text-[#C9A6FF] dark:text-white group-hover/signup:text-[#B39DDB] dark:group-hover/signup:text-white/70 transition-colors duration-300 font-medium">
                      {isLogin ? t('auth_signup') : t('auth_login')}
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C9A6FF] dark:bg-white group-hover/signup:w-full transition-all duration-300" />
                  </button>
                </motion.p>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
