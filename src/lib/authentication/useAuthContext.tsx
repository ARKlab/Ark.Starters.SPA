import { useContext, useEffect, useState } from 'react'

import { AuthenticationContext } from './authenticationContext'

export function useAuthContext() {
  const context = useContext(AuthenticationContext)
  if (!context) {
    throw new Error(
      'useAuthContext must be used within a AuthenticationProvider',
    )
  }

  const [isLogged, setIsLogged] = useState(
    context.getLoginStatus() === 'Logged',
  )

  useEffect(() => {
    const unsubscribe = context.onLoginStatus((status) => {
      setIsLogged(status === 'Logged')
    })
    return unsubscribe
  }, [context])

  return { context: context, isLogged: isLogged }
}
