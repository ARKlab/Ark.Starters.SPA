import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { i18nAlly } from "vite-plugin-i18n-ally/client";
import * as z from "zod";
import { makeZodI18nMap } from "zod-i18n-map";

import { supportedLngs } from "../../config/lang";

const fallbackLng = Object.keys(supportedLngs)[0];
const lookupTarget = "lang";

export const i18nSetup = async () => {
  if (i18next.isInitialized) return;

  z.setErrorMap(
    makeZodI18nMap({
      ns: ["zodCustom", "zod"],
      handlePath: {
        keyPrefix: "paths",
      },
    }),
  );

  await new Promise<void>(resolve => {
    const { asyncLoadResource } = i18nAlly({
      async onInit({ language }) {
        await i18next
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
            lng: language,

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

            react: {
              useSuspense: true,
            },

            // empty resources to avoid startup warning
            resources: {},

            nonExplicitSupportedLngs: true,
            cleanCode: true,
            lowerCaseLng: true,
          });
      },
      onInited() {
        resolve();
      },
      onResourceLoaded: (resources, { language }) => {
        Object.keys(resources).forEach(ns => {
          i18next.addResourceBundle(language, ns, resources[ns]);
        });
      },
      fallbackLng,
      detection: [
        {
          detect: "querystring",
          lookup: lookupTarget,
          cache: false,
        },
        {
          detect: "localStorage",
          cache: true,
          lookup: lookupTarget,
        },
        {
          detect: "navigator",
        },
        {
          detect: "htmlTag",
        },
      ],
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const _changeLanguage = i18next.changeLanguage;
    i18next.changeLanguage = async (lang: string, ...args) => {
      // Load resources before language change
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await asyncLoadResource(lang);
      return _changeLanguage(lang, ...args);
    };
  });
};
