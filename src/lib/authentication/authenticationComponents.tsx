import { ReactNode } from "react";
import { useAuthContext } from "./authenticationContext";
import Unauthorized from "../../features/unauthorized/view";

export function AuthenticatedOnly({
  component,
}: {
  component: () => ReactNode;
}): ReactNode {
  const { isLogged } = useAuthContext();
  const Component = component;
  return isLogged ? <Component /> : <Unauthorized />;
}
