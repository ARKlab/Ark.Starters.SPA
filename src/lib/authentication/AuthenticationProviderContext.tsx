import React from 'react'

import { AuthenticationContext } from './authenticationContext'
import type { AuthProvider } from './authProviderInterface'

type AuthContextChildrens = {
  children: React.ReactNode
  authProvider: AuthProvider
}

export default function AuthenticationProviderContext({
  children,
  authProvider: instance,
}: AuthContextChildrens) {
  return (
    <AuthenticationContext.Provider value={instance}>
      {children}
    </AuthenticationContext.Provider>
  )
}
