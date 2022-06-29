import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import XHR from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'

i18next
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `/locales/{{lng}}.json`
    },
    react: {
      useSuspense: true
    },
    fallbackLng: 'en',
    preload: ['en'],
    interpolation: {
      escapeValue: false
    }
  })

export { default } from 'i18next'
