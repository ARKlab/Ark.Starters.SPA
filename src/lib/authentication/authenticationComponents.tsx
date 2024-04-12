import { ReactNode } from "react";
import { useAuthContext } from "./authenticationContext";
import Unauthorized from "../../features/authentication/unauthorized";

export function AuthenticatedOnly({ children }: { children: ReactNode }) {
  const { isLogged } = useAuthContext();
  return isLogged ? children : <Unauthorized />;
}
