import { createContext } from "react";

import { AuthProvider } from "../providers/authProviderInterface";

export const AuthenticationContext = createContext<AuthProvider>(
  {} as AuthProvider
);
