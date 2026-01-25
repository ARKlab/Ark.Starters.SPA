import { makeZodI18nMap } from "@semihbou/zod-i18n-map";
import i18next, { getFixedT } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import * as z from "zod";

import { supportedLngs } from "../../config/lang";

import { addCustomFormatters } from "./formatters";

const langs = import.meta.env.MODE == "e2e" ? { en: "en" } : supportedLngs;
const fallbackLng = Object.keys(langs)[0];
const lookupTarget = "lang";

export const i18nSetup = async () => {
  if (i18next.isInitialized) return;

  const zodNs = ["zodCustom", "zod"];

  // All available namespaces
  const namespaces = ["translation", "libComponents", "gdpr", "zodCustom", "template"];

  await i18next
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      // Backend configuration for loading translations
      backend: {
        // Load path for translation files
        // This will make requests to /locales/{lng}/{ns}.json
        loadPath: "/locales/{{lng}}/{{ns}}.json",
        
        // Allow cross-domain requests (needed for dev server)
        crossDomain: false,
        
        // Parse data as JSON
        parse: (data: string) => JSON.parse(data),
      },

      // Language detection configuration
      detection: {
        // Order of detection methods
        order: ["querystring", "localStorage", "navigator", "htmlTag"],
        
        // Keys to lookup language from
        lookupQuerystring: lookupTarget,
        lookupLocalStorage: `i18next_${lookupTarget}`,
        
        // Cache user language on localStorage
        caches: ["localStorage"],
        
        // Don't cache in cookies
        excludeCacheFor: ["cimode"],
      },

      // Config options
      load: "languageOnly",
      ns: namespaces,
      defaultNS: "translation",

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
};
