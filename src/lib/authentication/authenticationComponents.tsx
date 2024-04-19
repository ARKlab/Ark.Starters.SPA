import type { ReactNode } from 'react'

import Unauthorized from '../../features/authentication/unauthorized'

import { useAuthContext } from './useAuthContext'

export function AuthenticatedOnly({ children }: { children: ReactNode }) {
  const { isLogged } = useAuthContext()
  return isLogged ? children : <Unauthorized />
}
