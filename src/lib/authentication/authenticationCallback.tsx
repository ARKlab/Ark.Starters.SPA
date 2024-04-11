import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { Init } from "../../features/authentication/authenticationSlice";
import { useAuthContext } from "./authenticationContext";
import { AuthStoreType } from "./authTypes";
import { Navigate, Outlet, redirect } from "react-router-dom";

export const AuthenticationCallback = (props: { redirectTo: string }) => {
  const dispatch = useAppDispatch();
  const { context, isLogged } = useAuthContext();

  useEffect(() => {
    if (!isLogged) {
      dispatch(Init()).then((x) => {
        const response = x.payload ? (x.payload as AuthStoreType) : null;
        if (
          response &&
          response.userInfo &&
          response.userInfo.username !== ""
        ) {
        }
      });
    }
  }, [dispatch, isLogged]);

  if (isLogged) {
    return <Navigate to={props.redirectTo} replace />;
  }
  return <></>;
};
