import { LocaleProvider } from "@chakra-ui/react"
import { Suspense } from 'react'
import { useTranslation } from "react-i18next";
import {
  RouterProvider
} from "react-router-dom";

import CenterSpinner from "./components/centerSpinner";
import { PWABadge } from './components/pwaBadge';
import SEO from './components/seo';
import useLocalizeDocumentAttributes from './lib/i18n/useLocalizeDocumentAttributes';
import { router } from "./lib/router";


const Main = () => {
  useLocalizeDocumentAttributes();
  const { i18n } = useTranslation();

  return (
    <>
      <Suspense
        fallback={<CenterSpinner />}
      >
        <LocaleProvider locale={i18n.language}>
          <SEO
            title={import.meta.env.VITE_APP_TITLE}
            description={import.meta.env.VITE_APP_DESCRIPTION}
            name={import.meta.env.VITE_APP_COMPANY}
          />
          <RouterProvider router={router} />
        </LocaleProvider>
      </Suspense >
      <PWABadge />
    </>
  );
};

export default Main
