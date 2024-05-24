//Exxpandible global interface for window object
declare global {
  interface Window {
    customSettings: CustomSettingsType;
  }
}

export type CustomSettingsType = {
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
