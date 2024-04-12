import { Route, Routes, Outlet } from "react-router-dom";
import Unauthorized from "./features/authentication/unauthorized";
import { ReactElement, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { DetectLoggedInUser } from "./features/authentication/authenticationSlice";
import { AuthenticationCallback } from "./lib/authentication/authenticationCallback";
import { useAuthContext } from "./lib/authentication/authenticationContext";
import { getEntryPointPath, mainSections } from "./siteMap/mainSections";
import { AuthenticatedOnly } from "./lib/authentication/authenticationComponents";
import Layout from "./layout";
import PageNotFound from "./componentsCommon/pageNotFound";

const Main = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(DetectLoggedInUser());
  }, [dispatch]);

  const routes = [] as React.ReactNode[];
  mainSections.forEach((x) =>
    x.subsections.forEach((s) => {
      if (s.subsections && s.subsections.length > 0) {
        s.subsections.forEach((sub) => {
          if (sub.component && sub.path) {
            routes.push(
              <Route
                key={x.path + s.path + sub.path}
                path={x.path + s.path + sub.path}
                element={
                  sub.authenticatedOnly ? (
                    <AuthenticatedOnly>
                      <sub.component />
                    </AuthenticatedOnly>
                  ) : (
                    <sub.component />
                  )
                }
              />
            );
          }
        });
      } else if (s.component && s.path) {
        routes.push(
          <Route
            key={x.path + s.path}
            path={x.path + s.path}
            element={
              s.authenticatedOnly ? (
                <AuthenticatedOnly>
                  <s.component />
                </AuthenticatedOnly>
              ) : (
                <s.component />
              )
            }
          />
        );
      }
    })
  );
  const entryPoint = getEntryPointPath(mainSections);
  return (
    <>
      <Routes>
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
      </Routes>
    </>
  );
};

export default Main;
