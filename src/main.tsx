import {
  RouterProvider
} from "react-router-dom";
import { useAppDispatch } from "./app/hooks";
import { DetectLoggedInUser } from "./lib/authentication/authenticationSlice";
import useLocalizeDocumentAttributes from "./lib/i18n/useLocalizeDocumentAttributes";
import useAsyncEffect from "./lib/useAsyncEffect";
import { router } from "./lib/router";

const Main = () => {
  const dispatch = useAppDispatch();

  useAsyncEffect(async () => {
    await dispatch(DetectLoggedInUser());
  }, [dispatch]);

  useLocalizeDocumentAttributes();

  return <RouterProvider router={router} />;
};

export default Main;
