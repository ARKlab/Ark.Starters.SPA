import { useAppDispatch } from "../../../app/hooks";
import CenterSpinner from "../../../components/centerSpinner";
import useAsyncEffect from "../../useAsyncEffect";
import { HandleRedirect } from "../authenticationSlice";

export const AuthenticationCallback = () => {
  const dispatch = useAppDispatch();

  useAsyncEffect(async () => {
    await dispatch(HandleRedirect());
  }, [dispatch]);

  return <CenterSpinner />;
};
