import { useAuthContext } from "./useAuthContext";

type protectedComponentProps = {
  permissions: string[];
  component: JSX.Element;
  fallBackComponent?: JSX.Element | null;
};

const ProtectedComponent = ({
  permissions,
  component,
  fallBackComponent,
}: protectedComponentProps) => {
  const { context } = useAuthContext();

  const hasAllPermissions = permissions.every((permission) =>
    context.hasPermission(permission)
  );

  if (!hasAllPermissions) {
    return fallBackComponent;
  }

  return component;
};

export default ProtectedComponent;
