/** Azure EntraId */
/* */
import { NoopAuthProvider, type AuthProvider } from "../lib/authentication/providers/authProviderInterface";
import { MsalAuthProvider } from "../lib/authentication/providers/msalAuthProvider";

import { appSettings } from "./env";

export const authProvider: AuthProvider = appSettings.msal
  ? new MsalAuthProvider({
      ...appSettings.msal,
      permissionsClaims: ["extension_Scope"],
    })
  : new NoopAuthProvider();

/* */

/** Auth0 */

/*

const claimsUrl = "http://ark-energy.eu/claims/";

import { Auth0AuthProvider } from "../lib/authentication/providers/auth0AuthProvider";
import type { AuthProvider } from "../lib/authentication/providers/authProviderInterface";

import { appSettings } from "./env";

export const authProvider: AuthProvider = new Auth0AuthProvider({
  ...appSettings,
  permissionsClaims: [claimsUrl + "permissions", claimsUrl + "groups"],
});

*/
