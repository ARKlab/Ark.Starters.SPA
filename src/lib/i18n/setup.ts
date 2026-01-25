import { makeZodI18nMap } from "@semihbou/zod-i18n-map";
import i18next, { getFixedT } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";
import * as z from "zod";

import { supportedLngs } from "../../config/lang";

import { addCustomFormatters } from "./formatters";

const langs = import.meta.env.MODE == "e2e" ? { en: "en" } : supportedLngs;
const fallbackLng = Object.keys(langs)[0];
const lookupTarget = "lang";

/**
 * Detects the user's preferred language using multiple strategies
 * Order: query string -> localStorage -> browser language -> HTML tag
 */
function detectLanguage(): string {
  // 1. Check query string (?lang=en)
  const params = new URLSearchParams(window.location.search);
  const langFromQuery = params.get(lookupTarget);
  if (langFromQuery && Object.keys(langs).includes(langFromQuery)) {
    return langFromQuery;
  }

  // 2. Check localStorage
  const savedLang = localStorage.getItem(`i18next_${lookupTarget}`);
  if (savedLang && Object.keys(langs).includes(savedLang)) {
    return savedLang;
  }

  // 3. Check browser language
  const browserLang = navigator.language?.split("-")[0];
  if (browserLang && Object.keys(langs).includes(browserLang)) {
    return browserLang;
  }

  // 4. Check HTML tag lang attribute
  const htmlLang = document.documentElement.lang?.split("-")[0];
  if (htmlLang && Object.keys(langs).includes(htmlLang)) {
    return htmlLang;
  }

  // 5. Fallback to default
  return fallbackLng;
}

export const i18nSetup = async () => {
  if (i18next.isInitialized) return;

  const zodNs = ["zodCustom", "zod"];
  const detectedLang = detectLanguage();

  // All available namespaces
  const namespaces = ["translation", "libComponents", "gdpr", "zodCustom", "template"];

  await i18next
    .use(initReactI18next)
    .use(
      resourcesToBackend((language: string, namespace: string) => {
        // Dynamic import for lazy loading with HMR support
        // Vite will bundle these per language automatically
        return import(`../../locales/${language}/${namespace}.json`);
      })
    )
    .init({
      // Config options
      load: "languageOnly",
      ns: namespaces,
      defaultNS: "translation",

      // Specifies the default language (locale) used
      // Detected from query string, localStorage, browser, or HTML tag
      lng: detectedLang,

      // Fallback locale used when a translation is
      // missing in the active locale
      fallbackLng: fallbackLng,
      supportedLngs: Object.keys(langs),

      // Enables useful output in the browser's dev console
      debug: import.meta.env.DEV,
      appendNamespaceToCIMode: true,
      appendNamespaceToMissingKey: true,
      returnNull: false,
      // if a key is empty, returns the key
      returnEmptyString: false,

      // Normally, we want `escapeValue: true` as it
      // ensures that i18next escapes any code in
      // translation messages, safeguarding against
      // XSS (cross-site scripting) attacks. However,
      // React does this escaping itself, so we turn
      // it off in i18next.
      interpolation: {
        escapeValue: false,
      },

      nsSeparator: ":",

      react: {
        useSuspense: true,
      },

      nonExplicitSupportedLngs: true,
      cleanCode: true,
      lowerCaseLng: true,
    });

  // Configure Zod with i18next translations
  const t = getFixedT(null, zodNs);
  z.config({
    customError: makeZodI18nMap({ t, ns: zodNs, handlePath: { keyPrefix: "paths" } }),
  });

  // Add custom formatters for date formatting
  addCustomFormatters(i18next);

  // Save detected language to localStorage for persistence
  localStorage.setItem(`i18next_${lookupTarget}`, detectedLang);

  // Override changeLanguage to save to localStorage
  const originalChangeLanguage = i18next.changeLanguage.bind(i18next);
  i18next.changeLanguage = async (lang: string, ...args) => {
    const result = await originalChangeLanguage(lang, ...args);
    localStorage.setItem(`i18next_${lookupTarget}`, lang);
    return result;
  };
};
