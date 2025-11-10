import { withAITracking } from "@microsoft/applicationinsights-react-js";
import type { ReactNode } from "react";
import type { RouteObject } from "react-router";
import { Outlet, createBrowserRouter } from "react-router";

import Layout from "../components/layout/layout";
import LazyLoad from "../components/lazyLoad";
import PageNotFound from "../components/pageNotFound";
import SEO from "../components/seo";
import { siteMap } from "../siteMap/siteMap";
import type { ArkRoute, ArkSubRoute } from "../siteMap/types";

import { reactPlugin } from "./applicationInsights";
import { AuthenticatedOnly } from "./authentication/components/authenticatedOnly";
import { AuthenticationCallback } from "./authentication/components/authenticationCallback";
import ProtectedRoute from "./authentication/components/protectedRoute";
import Unauthorized from "./authentication/unauthorized";
import { ErrorFallback } from "./errorFallback";

const wrapLazy = (x: ArkRoute) => {
  const checkPermissions = x.permissions && x.permissions.length > 0;

  let element: ReactNode = <Outlet />;
  if (x.component) {
    const X = withAITracking(reactPlugin, () => <>{x.component}</>, x.label);
    element = <X />;
  }
  // key={x.label} is needed to force a rerender when the route changes due to https://github.com/remix-run/react-router/issues/12474
  // assumption: x.label is unique across all routes
  // TODO: introduce x.id/x.slug to be used as key and tracking instead of x.label
  const lazy = x.lazy;
  if (lazy) {
    const y = async () => {
      const res = await lazy();
      return { default: withAITracking(reactPlugin, res.default, x.label) };
    };
    element = <LazyLoad loader={y} key={x.label} />;
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
    (x): RouteObject =>
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
              Component: withAITracking(reactPlugin, Unauthorized),
            },
            ...routes,
            {
              path: "null",
              element: null,
            },
            {
              path: "*",
              Component: withAITracking(reactPlugin, PageNotFound),
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
