import { useContext } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import { useTranslation } from '@/lib/i18n';

export const useLanguage = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const t = useTranslation(language);

  return { language, setLanguage, t };
};
