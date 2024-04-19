import { createContext } from 'react'

import type { AuthProvider } from './authProviderInterface'

export const AuthenticationContext = createContext<AuthProvider>(
  {} as AuthProvider,
)
