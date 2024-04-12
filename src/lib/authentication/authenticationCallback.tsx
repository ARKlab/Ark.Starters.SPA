import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { Init } from "../../features/authentication/authenticationSlice";
import { useAuthContext } from "./authenticationContext";
import { Navigate } from "react-router-dom";

export const AuthenticationCallback = (props: { redirectTo: string }) => {
  const dispatch = useAppDispatch();
  const { isLogged } = useAuthContext();

  useEffect(() => {
    if (!isLogged) {
      dispatch(Init())
    }
  }, [dispatch, isLogged]);

  if (isLogged) {
    return <Navigate to={props.redirectTo} replace />;
  }
  return <></>;
};
