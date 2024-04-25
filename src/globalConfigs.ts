import Auth0AuthProvider from "./lib/authentication/providers/auth0AuthProvider";
import type { AuthProvider } from "./lib/authentication/providers/authProviderInterface";

export const supportedLngs = {
  en: "English",
  it: "Italiano",
};


export const env = window.customSettings
export const authProvider: AuthProvider = new Auth0AuthProvider(env)