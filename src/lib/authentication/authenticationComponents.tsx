import { ReactNode } from "react";
import { useAuthContext } from "./authenticationContext";
import Unauthorized from "../../features/authentication/unauthorized";

export function AuthenticatedOnly({
  component,
}: {
  component: () => ReactNode;
}): ReactNode {
  const { isLogged } = useAuthContext();
  const Component = component;
  return isLogged ? <Component /> : <Unauthorized />;
}
