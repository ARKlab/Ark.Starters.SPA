import { useAppSelector } from "../../../app/hooks";
import { userSelector } from "../authenticationSlice";

type ProtectedComponentProps = {
  permissions: string[];
  children: React.ReactNode;
  fallBackComponent?: React.ReactNode;
};

const ProtectedComponent = ({
  permissions,
  children,
  fallBackComponent,
}: ProtectedComponentProps) => {
  const user = useAppSelector(userSelector);
  const userPermissions = user?.permissions ?? ([] as string[]);
  const hasAllPermissions = permissions.every(permission => userPermissions.includes(permission));

  if (!hasAllPermissions) {
    return <>{fallBackComponent}</>;
  }

  return <>{children}</>;
};

export default ProtectedComponent;
