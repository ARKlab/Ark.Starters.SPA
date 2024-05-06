import { Else, If, Then } from "react-if";
import { Outlet, Route, createBrowserRouter, createRoutesFromChildren } from "react-router-dom";

import PageNotFound from "../components/pageNotFound";
import SEO from "../components/seo";
import type { MainSectionType, SubsectionMenuItemType } from "../components/sideBar/menuItem/types";
import Layout from "../layout";
import { mainSections } from "../siteMap/mainSections";

import { AuthenticatedOnly } from "./authentication/components/authenticatedOnly";
import { AuthenticationCallback } from "./authentication/components/authenticationCallback";
import ProtectedRoute from "./authentication/components/protectedRoute";
import Unauthorized from "./authentication/unauthorized";
import { ErrorFallback } from "./errorFallback";

const wrapComponent = (x: MainSectionType) => {
  const checkPermissions = x.permissions && x.permissions.length > 0;

  return (
    <>
      <SEO title={x.label} />
      <If condition={x.authenticatedOnly}>
        <Then>
          <If condition={checkPermissions}>
            <Then>
              {() => (
                <AuthenticatedOnly>
                  <ProtectedRoute permissions={x.permissions}>{x.component ?? <Outlet />}</ProtectedRoute>
                </AuthenticatedOnly>
              )}
            </Then>
            <Else>{() => <AuthenticatedOnly>{x.component ?? <Outlet />}</AuthenticatedOnly>}</Else>
          </If>
        </Then>
        <Else>{() => <>{x.component ?? <Outlet />}</>}</Else>
      </If>
    </>
  );
};

const renderSections = (s?: SubsectionMenuItemType[]) => {
  return s
    ?.filter(x => x.path !== undefined)
    .map((x, i) =>
      x.path === "" && !x.subsections ? ( // index route, shall not have children
        <Route key={i} index element={wrapComponent(x)} />
      ) : (
        <Route key={i} path={x.path} element={wrapComponent(x)}>
          {renderSections(x.subsections)}
        </Route>
      ),
    );
};

const routes = mainSections
  .filter(x => x.path !== undefined)
  .map((x, i) =>
    x.path === "" && !x.subsections ? ( // index route, shall not have children
      <Route key={i} index element={wrapComponent(x)} />
    ) : (
      <Route key={i} path={x.path} element={wrapComponent(x)}>
        {renderSections(x.subsections)}
      </Route>
    ),
  );

export const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<Layout />}>
      <Route errorElement={<ErrorFallback />}>
        <Route path="auth-callback" element={<AuthenticationCallback />} />
        <Route path="Unauthorized" element={<Unauthorized />} />
        {routes}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Route>,
  ),
);
