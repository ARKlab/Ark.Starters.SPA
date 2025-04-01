/** Azure EntraId */
/* */
import type { AuthProvider } from "../lib/authentication/providers/authProviderInterface";
import { MsalAuthProvider } from "../lib/authentication/providers/msalAuthProvider";

import { appSettings } from "./env";

if (!appSettings.msal) throw new Error("MSAL settings not found in appSettings");

export const authProvider: AuthProvider = new MsalAuthProvider({
  ...appSettings.msal,
  permissionsClaims: ["extension_Scope"],
});

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
