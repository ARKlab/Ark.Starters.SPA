import { useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";

export interface PurposeCookieTypes {
  necessary?: boolean;
  preferences?: boolean;
  statistics?: boolean;
  marketing?: boolean;
}

type CookieTypes = PurposeCookieTypes;

export type AllCookieTypeKeys = keyof CookieTypes;

export type ConsentState = CookieTypes;

const COOKIE_CONSENT_KEY = "GDPR_CONSENT_STATE";

const allCookiesSetToValue = (value: boolean): ConsentState => ({
  necessary: true,
  preferences: value,
  statistics: value,
  marketing: value,
});

export const useCookieConsent = (): [
  ConsentState | undefined,
  {
    acceptAll: () => void;
    rejectNotNecessary: () => void;
    acceptSome: (c: ConsentState) => void;
  },
] => {
  const [consent, update] = useLocalStorage<ConsentState | undefined>(COOKIE_CONSENT_KEY, undefined, {
    initializeWithValue: true,
  });

  const acceptAll = useCallback(() => {
    update(allCookiesSetToValue(true));
  }, [update]);
  const rejectNotNecessary = useCallback(() => {
    update(allCookiesSetToValue(false));
  }, [update]);

  const acceptSome = useCallback(
    (c: ConsentState) => {
      update({ ...c, necessary: true });
    },
    [update],
  );

  return [
    consent,
    {
      acceptAll,
      rejectNotNecessary,
      acceptSome,
    },
  ];
};
