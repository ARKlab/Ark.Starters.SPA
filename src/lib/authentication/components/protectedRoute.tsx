import { useNavigate, Route } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";

type ProtectedRouteProps = {
  path: string;
  element: React.ReactElement;
  permissions: string[];
  fallbackPath?: string;
};

const ProtectedRoute = ({
  path,
  element,
  permissions,
  fallbackPath = "/",
}: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { context } = useAuthContext();

  // Check if the user has all the required permissions
  const hasAllPermissions = permissions.every((permission) =>
    context.hasPermission(permission)
  );

  if (!hasAllPermissions) {
    navigate(fallbackPath);
    return null;
  }
  return (
    <>
      <Route path={path} element={element} />
    </>
  );
};

export default ProtectedRoute;
