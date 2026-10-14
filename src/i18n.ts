import { createInstance } from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import sv from "./locales/sv.json"
import en from "./locales/en.json"

export function createTranslations () {
  const instance = createInstance()
  const languageDetector = new LanguageDetector()
  languageDetector.addDetector({
    cacheUserLanguage(language: string) {
      try {
        window.localStorage.setItem("i18nextLng", language)
      } catch {
        // Language switching still works when persistence is unavailable.
      }
    },
    lookup() {
      try {
        return window.localStorage.getItem("i18nextLng") ?? undefined
      } catch {
        return undefined
      }
    },
    name: "safeLocalStorage",
  })

  instance.use(languageDetector).init({
    debug: false,
    detection: {
      caches: ["safeLocalStorage"],
      order: ["querystring", "safeLocalStorage", "navigator", "htmlTag"],
    },
    fallbackLng: "sv",
    initAsync: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: en },
      sv: { translation: sv },
    },
    supportedLngs: ["sv", "en"],
  })

  return instance
}

const i18next = createTranslations()

const updateDocumentLanguage = (language: string) => {
  document.documentElement.lang = language.startsWith('en') ? 'en' : 'sv'
  document.title = i18next.t('pageTitle')
  document.querySelector('meta[name="description"]')?.setAttribute('content', i18next.t('description'))
}
i18next.on('languageChanged', updateDocumentLanguage)
updateDocumentLanguage(i18next.language)

export default i18next
