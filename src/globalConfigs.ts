import type { AuthProvider } from "./lib/authentication/providers/authProviderInterface";
import { MsalAuthProvider } from "./lib/authentication/providers/msalAuthProvider";

export const supportedLngs = {
  en: "English",
  it: "Italiano",
};

export const env = window.customSettings;
export const authProvider: AuthProvider = new MsalAuthProvider(env);
