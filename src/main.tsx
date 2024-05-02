import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import Unauthorized from "./lib/authentication/unauthorized";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { DetectLoggedInUser } from "./lib/authentication/authenticationSlice";
import { AuthenticationCallback } from "./lib/authentication/components/authenticationCallback";
import { getEntryPointPath, mainSections } from "./siteMap/mainSections";
import { AuthenticatedOnly } from "./lib/authentication/components/authenticationComponents";
import Layout from "./layout";
import PageNotFound from "./components/pageNotFound";
import { Else, If, Then } from "react-if";
import {
  MainSectionType,
  SubsectionMenuItemType,
} from "./components/sideBar/menuItem/types";
import { ErrorDisplay } from "./components/errorDisplay";
import SEO from "./components/seo";
import useLocalizeDocumentAttributes from "./lib/i18n/useLocalizeDocumentAttributes";
import ProtectedRoute from "./lib/authentication/components/protectedRoute";

const Main = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(DetectLoggedInUser());
  }, [dispatch]);

  useLocalizeDocumentAttributes();

  const wrapComponent = (x: MainSectionType) => {
    return (
      <>
        <SEO title={x.label} />
        <If condition={x.authenticatedOnly}>
          <Then>
            {() => (
              <AuthenticatedOnly>{x.component ?? <Outlet />}</AuthenticatedOnly>
            )}
          </Then>
          <Else>{() => <>{x.component ?? <Outlet />}</>}</Else>
        </If>
      </>
    );
  };

  const renderSections = (s?: SubsectionMenuItemType[]) => {
    return s
      ?.filter((x) => !!x.path)
      .map((x, i) =>
        x.permissions && x.permissions.length > 0 ? (
          <ProtectedRoute
            key={i}
            path={x.path!}
            permissions={x.permissions}
            element={wrapComponent(x)}
          />
        ) : (
          <Route key={i} path={x.path} element={wrapComponent(x)}>
            {renderSections(x.subsections)}
          </Route>
        )
      );
  };

  const routes = mainSections
    .filter((x) => !!x.path)
    .map((x, i) => (
      <Route key={i} path={x.path} element={wrapComponent(x)}>
        {renderSections(x.subsections)}
      </Route>
    ));

  const ErrorFallback = () => {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
      return (
        <ErrorDisplay name={String(error.status)} message={error.statusText} />
      );
    } else if (error instanceof Error)
      return (
        <ErrorDisplay
          name={error.name}
          message={error.message}
          stack={error.stack}
        />
      );
    else return <ErrorDisplay />;
  };

  const entryPoint = getEntryPointPath(mainSections);
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path="/" element={<Layout />}>
        <Route errorElement={<ErrorFallback />}>
          <Route
            index
            path=""
            element={<AuthenticationCallback redirectTo={entryPoint} />}
          />
          <Route path="Unauthorized" element={<Unauthorized />} />
          {routes}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default Main;
