import type { PropsWithChildren } from "react";

import { useAppSelector } from "../../../app/hooks";
import { userSelector } from "../authenticationSlice";
import Unauthorized from "../unauthorized";

type ProtectedRouteProps = {
  permissions?: string[];
};

const ProtectedRoute = ({ permissions, children }: PropsWithChildren<ProtectedRouteProps>) => {
  const user = useAppSelector(userSelector);
  const userPermissions = user?.permissions ?? ([] as string[]);
  const hasAllPermissions = permissions ? permissions.every(permission => userPermissions.includes(permission)) : true;

  return hasAllPermissions ? <>{children}</> : <Unauthorized />;
};

export default ProtectedRoute;
