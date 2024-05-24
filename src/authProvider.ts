import { env } from "./config/env";
import type { AuthProvider } from "./lib/authentication/providers/authProviderInterface";
import { MsalAuthProvider } from "./lib/authentication/providers/msalAuthProvider";

export const authProvider: AuthProvider = new MsalAuthProvider(env);
