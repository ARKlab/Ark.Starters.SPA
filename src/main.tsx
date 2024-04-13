
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromChildren } from "react-router-dom";
import Unauthorized from "./features/authentication/unauthorized";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { DetectLoggedInUser } from "./features/authentication/authenticationSlice";
import { AuthenticationCallback } from "./lib/authentication/authenticationCallback";
import { getEntryPointPath, mainSections } from "./siteMap/mainSections";
import { AuthenticatedOnly } from "./lib/authentication/authenticationComponents";
import Layout from "./layout";
import PageNotFound from "./componentsCommon/pageNotFound";
import { Helmet } from "react-helmet-async";
import { Else, If, Then } from "react-if";
import { MainSectionType, SubsectionMenuItemType } from "./components/sideBar/menuItem/types";

const Main = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(DetectLoggedInUser());
  }, [dispatch]);

  const wrapComponent = (x: MainSectionType) => {
    return (<>
      <Helmet>
        <title>{x.label}</title>
        <meta property="og:title" content={x.label} />
      </Helmet>
      <If condition={x.authenticatedOnly}>
        <Then>
          {() => (<AuthenticatedOnly>{x.component ?? <Outlet />}</AuthenticatedOnly>)}
        </Then>
        <Else>
          {x.component ?? <Outlet />}
        </Else>
      </If>
    </>);
  }

  const renderSections = (s?: SubsectionMenuItemType[]) => {
    return s?.filter(x => !!x.path).map((x, i) =>
      <Route key={i} path={x.path} element={wrapComponent(x)}>
        {renderSections(x.subsections)}
      </Route>
    );
  }

  const routes = mainSections.filter(x => !!x.path).map((x, i) =>
    <Route key={i} path={x.path} element={wrapComponent(x)} >
      {renderSections(x.subsections)}
    </Route>
  );

  const entryPoint = getEntryPointPath(mainSections);
  const router = createBrowserRouter(createRoutesFromChildren(
    <Route element={<Layout />}>
      <Route
        index
        path="/"
        element={<AuthenticationCallback redirectTo={entryPoint} />}
      />
      <Route path="/Unauthorized" element={<Unauthorized />} />
      {routes}
      <Route path="*" element={<PageNotFound />} />
    </Route>
  ));
  return (<RouterProvider router={router} />);
};

export default Main;
