import { ReactNode } from "react";
import { useAuthContext } from "./useAuthContext";
import Unauthorized from "../../features/authentication/unauthorized";

export function AuthenticatedOnly({
  component,
}: {
  component: () => ReactNode;
}): ReactNode {
  const { isLogged } = useAuthContext();
  return isLogged ? component() : <Unauthorized />;
}
