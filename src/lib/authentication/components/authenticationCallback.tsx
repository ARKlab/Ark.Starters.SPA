import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAppDispatch } from "../../../app/hooks";
import { Init } from "../authenticationSlice";

import { useAuthContext } from "./useAuthContext";

export const AuthenticationCallback = (props: { redirectTo: string }) => {
  const dispatch = useAppDispatch()
  const { isLogged } = useAuthContext()

  useEffect(() => {
    if (!isLogged) {
      dispatch(Init());
    }
  }, [dispatch, isLogged])

  if (isLogged) {
    return <Navigate to={props.redirectTo} replace />
  }
  return <></>
}
