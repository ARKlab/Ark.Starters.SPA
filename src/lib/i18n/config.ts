import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import z from "zod";
import { makeZodI18nMap } from "zod-i18n-map";

import { supportedLngs } from "../../globalConfigs";

i18n
  // Add React bindings as a plugin.
  .use(HttpApi)
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
    fallbackLng: "en",
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

    ns: ["translation", "zod", "zodCustom"],
  });

z.setErrorMap(
  makeZodI18nMap({
    ns: ["zodCustom", "zod"],
    handlePath: {
      keyPrefix: "paths",
    },
  })
);

export default i18n;
