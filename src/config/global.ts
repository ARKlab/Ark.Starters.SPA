//Exxpandible global interface for window object
declare global {
  interface Window {
    appSettings: AppSettingsType;
  }
}

export type AppSettingsType = {
  clientID: string;
  domain: string;
  scopes: string;
  knownAuthorities: string;
  signUpSignInPolicyId: string;
  serviceUrl: string;
  redirectUri: string;
  authority: string;
  audience: string;
};
