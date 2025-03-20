import type { ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import { Outlet, createBrowserRouter } from "react-router-dom";

import Layout from "../components/layout/layout";
import type { MainSectionType, SubsectionMenuItemType } from "../components/layout/sideBar/menuItem/types";
import LazyLoad from "../components/lazyLoad";
import PageNotFound from "../components/pageNotFound";
import SEO from "../components/seo";
import { mainSections } from "../siteMap/mainSections";

import { AuthenticatedOnly } from "./authentication/components/authenticatedOnly";
import { AuthenticationCallback } from "./authentication/components/authenticationCallback";
import ProtectedRoute from "./authentication/components/protectedRoute";
import Unauthorized from "./authentication/unauthorized";
import { ErrorFallback } from "./errorFallback";

const wrapLazy = (x: MainSectionType) => {
  const checkPermissions = x.permissions && x.permissions.length > 0;

  let element: ReactNode = <Outlet />;
  if (x.component) element = x.component;
  const lazy = x.lazy;
  // key={x.label} is needed to force a rerender when the route changes due to https://github.com/remix-run/react-router/issues/12474
  // assumption: x.label is unique across all routes
  if (lazy) element = <LazyLoad loader={lazy} key={x.label} />;

  if (checkPermissions)
    element =
      <ProtectedRoute permissions={x.permissions}>
        {element}
      </ProtectedRoute>

  if (x.authenticatedOnly)
    element =
      <AuthenticatedOnly>
        {element}
      </AuthenticatedOnly>

  return (
    <>
      <SEO title={x.label} />
      {element}
    </>
  );
};

const renderSections = (s?: SubsectionMenuItemType[]) => {
  return s
    ?.filter(x => x.path !== undefined)
    .map((x): RouteObject =>
      x.path === "" && !x.subsections ? ( // index route, shall not have children
        { index: true, element: wrapLazy(x) }
      ) : (
        { path: x.path, element: wrapLazy(x), children: renderSections(x.subsections) }
      ),
    );
};

const routes = mainSections
  .filter(x => x.path !== undefined)
  .map((x): RouteObject =>
    x.path === "" && !x.subsections ? ( // index route, shall not have children
      { index: true, element: wrapLazy(x) }
    ) : (
      { path: x.path, element: wrapLazy(x), children: renderSections(x.subsections) }
    ),
  );

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        errorElement: <ErrorFallback />,
        children: [
          {
            path: "auth-callback",
            Component: AuthenticationCallback
          },
          {
            path: "Unauthorized",
            Component: Unauthorized
          },
          ...routes,
          {
            path: "null",
            element: null
          },
          {
            path: "*",
            Component: PageNotFound
          }
        ]
      }
    ]
  }
],
  {
    future: {
    }
  }

);

if (window.Cypress)
  window.router = router;