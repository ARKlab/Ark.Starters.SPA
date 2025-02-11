import { Suspense } from 'react'
import {
  RouterProvider
} from "react-router-dom";

import CenterSpinner from "./components/centerSpinner";
import { PWABadge } from './components/pwaBadge';
import SEO from './components/seo';
import { Toaster } from './components/ui/toaster';
import useLocalizeDocumentAttributes from './lib/i18n/useLocalizeDocumentAttributes';
import { router } from "./lib/router";


const Main = () => {
  useLocalizeDocumentAttributes();

  return (
    <>
      <Suspense
        fallback={<CenterSpinner />}
      >
        <SEO
          title={import.meta.env.VITE_APP_TITLE}
          description={import.meta.env.VITE_APP_DESCRIPTION}
          name={import.meta.env.VITE_APP_COMPANY}
        />
        <RouterProvider router={router} />
      </Suspense>
      <Toaster />
      <PWABadge />
    </>
  );
};

export default Main
