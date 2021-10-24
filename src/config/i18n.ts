import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: require('./locales/en').default,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    react: {
      useSuspense: true,
    },
    resources,
    compatibilityJSON: 'v3',
    fallbackLng: ['en', 'de'],
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
