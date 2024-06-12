import { env } from "./config/env";
import { Auth0AuthProvider } from "./lib/authentication/providers/auth0AuthProvider";
import type { AuthProvider } from "./lib/authentication/providers/authProviderInterface";

export const authProvider: AuthProvider = new Auth0AuthProvider(env);
