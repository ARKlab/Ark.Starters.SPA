import React from "react";

import { useAppSelector } from "../../../app/hooks";
import { userSelector } from "../authenticationSlice";
import Unauthorized from "../unauthorized";

type ProtectedRouteProps = {
  permissions?: string[];
  children: React.ReactNode;
};

const ProtectedRoute = ({ permissions, children }: ProtectedRouteProps) => {
  const user = useAppSelector(userSelector);
  const userPermissions = user?.permissions ?? ([] as string[]);
  const hasAllPermissions = permissions ? permissions.every(permission => userPermissions.includes(permission)) : true;

  return hasAllPermissions ? <>{children}</> : <Unauthorized />;
};

export default ProtectedRoute;
