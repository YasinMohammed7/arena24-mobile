import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage } from '@/i18n/config';

export type SupportedLanguage = 'de' | 'en' | 'ro';

export const useLanguage = () => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    getCurrentLanguage() as SupportedLanguage
  );

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng as SupportedLanguage);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const switchLanguage = useCallback(async (language: SupportedLanguage) => {
    try {
      await changeLanguage(language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }, []);

  const toggleLanguage = useCallback(async () => {
    const languages: SupportedLanguage[] = ['de', 'en', 'ro'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextLanguage = languages[(currentIndex + 1) % languages.length];
    await switchLanguage(nextLanguage);
  }, [currentLanguage, switchLanguage]);

  // Map language codes to locale strings for date formatting
  const getLocale = useCallback(() => {
    const localeMap: Record<SupportedLanguage, string> = {
      ro: 'ro-RO',
      en: 'en-US',
      de: 'de-DE',
    };
    return localeMap[currentLanguage];
  }, [currentLanguage]);

  return {
    t,
    currentLanguage,
    switchLanguage,
    toggleLanguage,
    getLocale,
    isGerman: currentLanguage === 'de',
    isEnglish: currentLanguage === 'en',
    isRomanian: currentLanguage === 'ro',
  };
};
