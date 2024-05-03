import React from "react";
import { Navigate } from "react-router-dom";

import { useAuthContext } from "./useAuthContext"; // replace with your auth context

type ProtectedRouteProps = {
  permissions?: string[];
  children: React.ReactNode;
};

const ProtectedRoute = ({ permissions, children }: ProtectedRouteProps) => {
  const { context } = useAuthContext();
  const hasAllPermissions = permissions ? permissions.every(permission => context.hasPermission(permission)) : true;

  return hasAllPermissions ? <>{children}</> : <Navigate to="/Unauthorized" />;
};

export default ProtectedRoute;
