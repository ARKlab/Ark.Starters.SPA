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
  const [consent, update] = useLocalStorage<ConsentState | undefined>(
    COOKIE_CONSENT_KEY,
    undefined,
    {
      initializeWithValue: true,
    },
  );

  const acceptAll = () => {
    update(allCookiesSetToValue(true));
  };
  const rejectNotNecessary = () => {
    update(allCookiesSetToValue(false));
  };

  const acceptSome = (c: ConsentState) => {
    update({ ...c, necessary: true });
  };

  return [
    consent,
    {
      acceptAll,
      rejectNotNecessary,
      acceptSome,
    },
  ];
};
