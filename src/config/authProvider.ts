import type { AuthProvider } from "../lib/authentication/providers/authProviderInterface";
import { MsalAuthProvider } from "../lib/authentication/providers/msalAuthProvider";

import { env } from "./env";

export const authProvider: AuthProvider = new MsalAuthProvider(env);
