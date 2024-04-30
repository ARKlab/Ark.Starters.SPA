import {
  RouterProvider
} from "react-router-dom";
import { router } from "./lib/router";
import { Suspense } from "react";
import CenterSpinner from "./components/centerSpinner";

const Main = () => {

  return (
    <Suspense
      fallback={<CenterSpinner />}
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Main;
