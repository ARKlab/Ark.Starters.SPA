import { createContext } from "react"

import type { AuthProvider } from "../providers/authProviderInterface"

export const AuthenticationContext = createContext({} as AuthProvider)
