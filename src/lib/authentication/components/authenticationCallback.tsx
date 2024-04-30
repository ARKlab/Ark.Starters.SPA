import { useAppDispatch } from "../../../app/hooks";
import { HandleRedirect } from "../authenticationSlice";
import useAsyncEffect from "../../useAsyncEffect";
import CenterSpinner from "../../../components/centerSpinner";

export const AuthenticationCallback = () => {
  const dispatch = useAppDispatch();

  useAsyncEffect(async () => {
    await dispatch(HandleRedirect());
  }, [dispatch]);

  return <CenterSpinner />;
};
