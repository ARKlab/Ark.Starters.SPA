import { Center, Spinner, Toast, useToast } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/footer/footer";
import Header from "./components/header/view";
import { Selectors as errorSelectors } from "./features/errorHandler/errorHandler";
import {
  resetNotification,
  selectNotification,
} from "./features/notifications/notification";
import Unauthorised from "./features/unauthorised/view";

import { Box } from "@chakra-ui/react";

import SimpleSidebar from "./components/sideBar/sideBar";

import { ReactElement, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { ProblemDetailsModal } from "./componentsCommon/problemDetailsModal/problemDetailsModal";
import { LoginStatus } from "./lib/authentication/authTypes";
import { mainSections } from "./siteMap/mainSections";
import { useAuthContext } from "./lib/authentication/authenticationContext";
import { init } from "ramda";
import { AuthenticationComponent } from "./lib/authentication/authenticationComponent";
import { useSelector } from "react-redux";
import { RootState } from ".";
import { DetectLoggedInUser } from "./features/authentication/authenticationSlice";
import JsonPlaceHolderView from "./features/jsonPlaceholderAPI/JsonPlaceHolder";

//export const authProvider = new Auth0AuthProvider(authConfig);

function initPath(
  path: string,
  element: () => React.ReactNode,
  authorizedOnly: boolean = true,
  userIsLogged: boolean = true
): ReactElement {
  const routeElement = element();
  const finalElement =
    (authorizedOnly && userIsLogged) || !authorizedOnly ? (
      routeElement
    ) : (
      <Unauthorised />
    );
  return <Route path={path} element={finalElement} />;
}

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
              initPath(
                x.path + s.path + sub.path,
                sub.component,
                sub.authorizedOnly,
                isLogged
              )
            );
          }
        });
      } else if (s.component && s.path) {
        routes.push(
          initPath(x.path + s.path, s.component, s.authorizedOnly, isLogged)
        );
      }
    })
  );

  return (
    <>
      <Routes>
        <Route
          index
          path="/"
          element={
            <AuthenticationComponent
              entryPoint={<JsonPlaceHolderView />} //Change this to your preffered entry point
              fallBack={<Unauthorised />}
            />
          }
        />
        <Route path="/Unauthorized" element={<Unauthorised />} />
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
        <Box ml={{ base: 0, md: 60 }} p="4">
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
