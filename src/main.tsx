import { useToast } from "@chakra-ui/react";
import { Route, Routes, Outlet } from "react-router-dom";
import Footer from "./components/footer/footer";
import Header from "./components/header/view";
import { Selectors as errorSelectors } from "./features/errorHandler/errorHandler";
import {
  resetNotification,
  selectNotification,
} from "./features/notifications/notification";
import Unauthorized from "./features/unauthorized/view";

import { Box } from "@chakra-ui/react";

import SimpleSidebar from "./components/sideBar/sideBar";

import { ReactElement, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { ProblemDetailsModal } from "./componentsCommon/problemDetailsModal/problemDetailsModal";
import { DetectLoggedInUser } from "./features/authentication/authenticationSlice";
import JsonPlaceHolderView from "./features/jsonPlaceholderAPI/JsonPlaceHolder";
import { AuthenticationCallback } from "./lib/authentication/authenticationCallback";
import { useAuthContext } from "./lib/authentication/authenticationContext";
import { getEntryPointPath, mainSections } from "./siteMap/mainSections";
import NoEntryPoint from "./features/NoEntryPoint/staticPage";
import { AuthenticatedOnly } from "./lib/authentication/authenticationComponents";

//export const authProvider = new Auth0AuthProvider(authConfig);x

const Component = () => {
  const { context, isLogged } = useAuthContext();
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
                path={x.path + s.path + sub.path}
                element={
                  sub.authenticatedOnly ? (
                    <AuthenticatedOnly component={sub.component} />
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
            path={x.path + s.path}
            element={
              s.authenticatedOnly ? (
                <AuthenticatedOnly component={s.component} />
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
        <Route
          index
          path="/"
          element={<AuthenticationCallback redirectTo={entryPoint} />}
        />
        <Route path="/Unauthorized" element={<Unauthorized />} />
        {routes}
      </Routes>
    </>
  );
};

const Main = () => {
  var toast = useToast();

  const dispatch = useAppDispatch();
  const notification = useAppSelector(selectNotification);
  const problemDetails = useAppSelector(errorSelectors.all);
  useEffect(() => {
    if (notification) {
      toast({
        title: notification.title,
        description: notification.message,
        status: notification.status,
        duration: notification.duration,
        isClosable: notification.isClosable,
        position: notification.position,
      });
      dispatch(resetNotification());
    }
  }, [notification, toast, dispatch]);

  return (
    <>
      <Header />
      <Box minH="70vh">
        <SimpleSidebar />
        <Box ml={{ base: 0, md: 60 }} p="4" my={"70px"}>
          {Component()}
        </Box>
      </Box>
      <Footer />
      {problemDetails.error === true ? (
        <ProblemDetailsModal problem={problemDetails} />
      ) : (
        <></>
      )}
    </>
  );
};

export default Main;
