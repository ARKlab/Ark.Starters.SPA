import { useCallback } from "react";

import useCookie from "./useCookie";

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

const cookieOptions: Cookies.CookieAttributes = {
  expires: 365,
};

export const useCookieConsent = (): [
  ConsentState | undefined,
  {
    acceptAll: () => void;
    rejectNotNecessary: () => void;
    acceptSome: (c: ConsentState) => void;
  },
] => {
  const [consent, { updateCookie }] = useCookie<ConsentState>(COOKIE_CONSENT_KEY, undefined);

  const acceptAll = useCallback(() => {
    updateCookie(allCookiesSetToValue(true), cookieOptions);
  }, [updateCookie]);
  const rejectNotNecessary = useCallback(() => {
    updateCookie(allCookiesSetToValue(false), cookieOptions);
  }, [updateCookie]);

  const acceptSome = useCallback(
    (c: ConsentState) => {
      updateCookie({ ...c, necessary: true }, cookieOptions);
    },
    [updateCookie],
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
