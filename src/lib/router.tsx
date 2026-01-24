import type { ReactNode } from "react";
import type { RouteObject } from "react-router";
import { Outlet, createBrowserRouter } from "react-router";

import Layout from "../components/layout/layout";
import PageNotFound from "../components/pageNotFound";
import SEO from "../components/seo";
import { siteMap } from "../siteMap/siteMap";

import { AuthenticatedOnly } from "./authentication/components/authenticatedOnly";
import { AuthenticationCallback } from "./authentication/components/authenticationCallback";
import ProtectedRoute from "./authentication/components/protectedRoute";
import Unauthorized from "./authentication/unauthorized";
import { LazyComponent } from "./components/LazyComponent";
import { ErrorFallback } from "./errorFallback";
import type { ArkRoute, ArkSubRoute } from "./siteMapTypes";

const wrapLazy = (x: ArkRoute) => {
  const checkPermissions = x.permissions && x.permissions.length > 0;

  let element: ReactNode = <Outlet />;
  if (x.component) {
    element = <>{x.component}</>;
  }
  // key={x.label} is needed to force a rerender when the route changes due to https://github.com/remix-run/react-router/issues/12474
  // assumption: x.label is unique across all routes
  // TODO: introduce x.id/x.slug to be used as key and tracking instead of x.label
  const lazy = x.lazy;
  if (lazy) {
    element = <LazyComponent loader={lazy} key={x.label} />;
  }

  if (checkPermissions) element = <ProtectedRoute permissions={x.permissions}>{element}</ProtectedRoute>;

  if (x.authenticatedOnly) element = <AuthenticatedOnly>{element}</AuthenticatedOnly>;

  return (
    <>
      <SEO title={x.label} />
      {element}
    </>
  );
};

const renderSections = (s?: ArkSubRoute[]) => {
  return s
    ?.filter(x => x.path !== undefined)
    .map(
      (x): RouteObject =>
        x.path === "" && !x.subsections // index route, shall not have children
          ? { index: true, element: wrapLazy(x) }
          : { path: x.path, element: wrapLazy(x), children: renderSections(x.subsections) },
    );
};

const routes = siteMap
  .filter(x => x.path !== undefined)
  .map(
    (x: ArkRoute): RouteObject =>
      x.path === "" && !x.subsections // index route, shall not have children
        ? { index: true, element: wrapLazy(x) }
        : { path: x.path, element: wrapLazy(x), children: renderSections(x.subsections) },
  );

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      children: [
        {
          errorElement: <ErrorFallback />,
          children: [
            {
              path: "auth-callback",
              Component: AuthenticationCallback,
            },
            {
              path: "Unauthorized",
              Component: Unauthorized,
            },
            ...routes,
            {
              path: "null",
              element: null,
            },
            {
              path: "*",
              Component: PageNotFound,
            },
          ],
        },
      ],
    },
  ],
  {
    future: {},
  },
);

if (import.meta.env.DEV || import.meta.env.MODE === "e2e") window.router = router;
