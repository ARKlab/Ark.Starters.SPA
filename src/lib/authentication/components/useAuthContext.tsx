import { useContext, useEffect, useState } from "react";
import { AuthenticationContext } from "./authenticationContext";

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
    const unsubscribe = context.onLoginStatus((status) => {
      const newIsLogged = status === "Logged";
      if (isLogged !== newIsLogged) {
        setIsLogged(newIsLogged);
      }
    });
    return unsubscribe;
  }, [context, isLogged]);

  return { context: context, isLogged: isLogged };
}
