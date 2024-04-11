import React, { createContext, useState, useContext, useEffect } from "react";

import { AuthProvider } from "./authProviderInterface";

const AuthenticationContext = createContext<AuthProvider>({} as AuthProvider);

type AuthContextChildrens = {
  children: React.ReactNode;
  authProvider: AuthProvider;
};

export default function AuthenticationProviderContext({
  children,
  authProvider: instance,
}: AuthContextChildrens) {
  return (
    <AuthenticationContext.Provider value={instance}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within a AuthenticationProvider"
    );
  }

  const [isLogged, setIsLogged] = useState(
    context.getLoginStatus() === "Logged"
  );

  useEffect(() => {
    const unsubscribe = context.subscribe((status) => {
      setIsLogged(status === "Logged");
    });
    return unsubscribe;
  }, [context]);

  return { context: context, isLogged: isLogged };
}
