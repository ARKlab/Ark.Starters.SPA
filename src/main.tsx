import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";

import CenterSpinner from "./components/centerSpinner";
import { router } from "./lib/router";

const Main = () => {
  return (
    <Suspense fallback={<CenterSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default Main;
