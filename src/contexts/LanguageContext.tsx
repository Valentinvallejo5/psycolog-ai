import { createContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'es',
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [language, setLanguageState] = useState<Language>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('language');
    return (stored === 'en' || stored === 'es') ? stored : 'es';
  });

  // Load language preference from database when user logs in
  useEffect(() => {
    if (user) {
      const loadUserLanguage = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('language_preference')
          .eq('id', user.id)
          .single();

        if (!error && data?.language_preference) {
          setLanguageState(data.language_preference as Language);
          localStorage.setItem('language', data.language_preference);
        }
      };
      loadUserLanguage();
    }
  }, [user]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    // Update database if user is authenticated
    if (user) {
      await supabase
        .from('profiles')
        .update({ language_preference: lang })
        .eq('id', user.id);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
