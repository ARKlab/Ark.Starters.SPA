import { createContext } from "react"

import type { AuthProvider } from "../providers/authProviderInterface"

export const AuthenticationContext = createContext<AuthProvider>({} as AuthProvider)
