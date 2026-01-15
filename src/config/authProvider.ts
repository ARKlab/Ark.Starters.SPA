/** Dynamic Authentication Provider Loading */
import type { AuthProvider } from "../lib/authentication/providers/authProviderInterface";
import { NoopAuthProvider } from "../lib/authentication/providers/authProviderInterface";

import { appSettings } from "./env";

/**
 * Dynamically loads the appropriate authentication provider based on configuration.
 * This reduces bundle size by only including the auth provider that's actually used.
 * 
 * @returns Promise<AuthProvider> The configured authentication provider
 */
export async function getAuthProvider(): Promise<AuthProvider> {
  // MSAL (Azure AD B2C / Entra ID)
  if (appSettings.msal) {
    const { MsalAuthProvider } = await import("../lib/authentication/providers/msalAuthProvider");
    return new MsalAuthProvider({
      ...appSettings.msal,
      permissionsClaims: ["extension_Scope"],
    });
  }
  
  // Auth0 (currently commented out in config, but supported)
  // Uncomment this and comment out MSAL section above to use Auth0
  /*
  if (appSettings.auth0) {
    const claimsUrl = "http://ark-energy.eu/claims/";
    const { Auth0AuthProvider } = await import("../lib/authentication/providers/auth0AuthProvider");
    return new Auth0AuthProvider({
      ...appSettings,
      permissionsClaims: [claimsUrl + "permissions", claimsUrl + "groups"],
    });
  }
  */
  
  // No authentication configured
  return new NoopAuthProvider();
}
