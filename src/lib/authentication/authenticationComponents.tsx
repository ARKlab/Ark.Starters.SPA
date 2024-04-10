import { ReactNode } from "react";
import { useAuthContext } from "./authenticationContext";
import Unauthorized from "../../features/unauthorized/view";

export function AuthenticatedOnly({
  component,
}: {
  component: () => ReactNode;
}): ReactNode {
  const { isLogged } = useAuthContext();
  return isLogged ? component() : <Unauthorized />;
}
