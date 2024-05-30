import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { setupI18n } from "vite-plugin-i18n-ally/client";
import * as z from "zod";
import { makeZodI18nMap } from "zod-i18n-map";

import { supportedLngs } from "../../config/lang";

const fallbackLng = Object.keys(supportedLngs)[0];
const lookupTarget = "lang";

export const i18nSetup = async () => {
  if (i18n.isInitialized) return;

  z.setErrorMap(
    makeZodI18nMap({
      ns: ["zodCustom", "zod"],
      handlePath: {
        keyPrefix: "paths",
      },
    }),
  );

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    // Initialize the i18next instance.
    .init({
      // Config options
      load: "languageOnly",

      // Specifies the default language (locale) used
      // when a user visits our site for the first time.
      // We use English here, but feel free to use
      // whichever locale you want.
      // disabled: conflict with LanguageDetector
      //lng: "en",

      // Fallback locale used when a translation is
      // missing in the active locale. Again, use your
      // preferred locale here.
      fallbackLng: fallbackLng,
      supportedLngs: Object.keys(supportedLngs),

      // Enables useful output in the browser’s
      // dev console.
      debug: import.meta.env.DEV,

      // Normally, we want `escapeValue: true` as it
      // ensures that i18next escapes any code in
      // translation messages, safeguarding against
      // XSS (cross-site scripting) attacks. However,
      // React does this escaping itself, so we turn
      // it off in i18next.
      interpolation: {
        escapeValue: false,
      },

      // if a key is empty, returns the key
      returnEmptyString: false,

      nsSeparator: ".",
      detection: {
        caches: ["localStorage", "sessionStorage", "cookie"],
        lookupQuerystring: lookupTarget,
        // ... For more configurations, please refer to `i18next-browser-languagedetector`
      },

      // empty resources to avoid startup warning
      resources: {},

      nonExplicitSupportedLngs: true,
      cleanCode: true,
      lowerCaseLng: true,
    });

  await new Promise<void>(resolve => {
    const { loadResourceByLang } = setupI18n({
      language: i18n.language,
      onInited() {
        resolve();
      },
      onResourceLoaded: (langs, currentLang) => {
        // Once the resource is loaded, add it to i18next
        Object.keys(langs).forEach(ns => {
          i18n.addResourceBundle(currentLang, ns, langs[ns]);
        });
      },
      fallbackLng,
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const _changeLanguage = i18n.changeLanguage;
    i18n.changeLanguage = async (lang: string, ...args) => {
      // Load resources before language change
      await loadResourceByLang(lang);
      return _changeLanguage(lang, ...args);
    };
  });
};
