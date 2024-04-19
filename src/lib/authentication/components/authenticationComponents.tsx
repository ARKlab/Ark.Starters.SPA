import { ReactNode } from "react";
import { useAuthContext } from "./useAuthContext";
import Unauthorized from "../unauthorized";

export function AuthenticatedOnly({ children }: { children: ReactNode }) {
  const { isLogged } = useAuthContext();
  return isLogged ? children : <Unauthorized />;
}
