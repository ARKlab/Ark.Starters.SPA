import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { Init } from "../../features/authentication/authenticationSlice";
import { useAuthContext } from "./authenticationContext";
import { AuthStoreType } from "./authTypes";

export const AuthenticationComponent = (props: {
  entryPoint: ReactNode;
  fallBack: ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const { context, isLogged } = useAuthContext();
  const [component, setComponent] = useState<ReactNode>(props.fallBack);

  useEffect(() => {
    if (!isLogged) {
      dispatch(Init()).then((x) => {
        const response = x.payload ? (x.payload as AuthStoreType) : null;
        if (
          response &&
          response.userInfo &&
          response.userInfo.username !== ""
        ) {
          setComponent(props.entryPoint);
        }
      });
    } else {
      setComponent(props.entryPoint);
    }
  }, [dispatch, isLogged, props.entryPoint]);

  return <>{component}</>;
};
