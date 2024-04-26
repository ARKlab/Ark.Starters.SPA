import { useAppDispatch } from "../../../app/hooks";
import { HandleRedirect } from "../authenticationSlice";
import { useAuthContext } from "./useAuthContext";
import useAsyncEffect from "../../useAsyncEffect";

export const AuthenticationCallback = () => {
  const dispatch = useAppDispatch();
  const { isLogged } = useAuthContext();

  useAsyncEffect(async () => {
    if (!isLogged) {
      await dispatch(HandleRedirect());
    }
  }, [dispatch, isLogged]);

  return <></>;
};
