import { createContext } from "react";

import { AuthProvider } from "./authProviderInterface";

export const AuthenticationContext = createContext<AuthProvider>({} as AuthProvider);


