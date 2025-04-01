import type { ApplicationInsightsConfig } from "../lib/applicationInsights";
import type { Auth0AuthProviderConfig } from "../lib/authentication/providers/auth0AuthProvider";
import type { MsalAuthProviderConfig } from "../lib/authentication/providers/msalAuthProvider";

//Exxpandible global interface for window object
declare global {
  interface Window {
    appSettings: AppSettingsType;
  }
}

export type AppSettingsType = {
  auth0?: Auth0AuthProviderConfig;
  msal?: MsalAuthProviderConfig;
  applicationInsights?: ApplicationInsightsConfig;
  serviceUrl?: string;
};
