import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import ro from './locales/ro.json';
import de from './locales/de.json';

const LANGUAGE_KEY = '@app_language';

const resources = {
  en: {
    translation: en,
  },
  ro: {
    translation: ro,
  },
  de: {
    translation: de,
  },
};

// Initialize i18n synchronously with default language
i18n.use(initReactI18next).init({
  resources,
  lng: 'de', // Default language
  fallbackLng: 'de',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

// Load saved language asynchronously after initialization
export const loadSavedLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en' || savedLanguage === 'ro')) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Error loading saved language:', error);
  }
};

export const changeLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

export const getCurrentLanguage = () => i18n.language;

export default i18n;
