import { Spinner, useToast } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/footer/footer";
import Header from "./components/header/view";
import {
  Selectors as errorSelectors,
  setError,
} from "./features/errorHandler/errorHandler";
import {
  resetNotification,
  selectNotification,
} from "./features/notifications/notification";
import Unauthorised from "./features/unauthorised/view";

import { Box } from "@chakra-ui/react";

import SimpleSidebar from "./components/sideBar/sideBar";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./app/configureStore";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { ProblemDetailsModal } from "./componentsCommon/problemDetailsModal/problemDetailsModal";
import {
  Login,
  getLoginStatus,
  Init,
} from "./features/authentication/authenticationSlice";
import { LoginStatus } from "./lib/authentication/authTypes";
import { mainSections } from "./siteMap/mainSections";

const Component = () => {
  return (
    <>
      <Routes>
        <Route
          index
          path="/"
          element={<Navigate to="/main/jsonplaceholder" />}
        />
        <Route path="/Unauthorized" element={<Unauthorised />} />
        {mainSections.map((x) =>
          x.subsections.map((s) => {
            return s.subsections && s.subsections.length > 0 ? (
              s.subsections.map((sub) => {
                return sub.component && sub.path ? (
                  <Route
                    path={x.path + s.path + sub.path}
                    element={sub.component()}
                  />
                ) : null;
              })
            ) : s.component && s.path ? (
              <Route path={x.path + s.path} element={s.component()} />
            ) : null;
          })
        )}
      </Routes>
    </>
  );
};

const Main = () => {
  const notification = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.data;
  const [loginstatus, setLoginStatus] = useState(LoginStatus.NotLogged);
  var toast = useToast();
  useEffect(() => {
    const initializeAuth = async () => {
      await dispatch(Init()).then(async () => {
        if (!user) {
          await dispatch(Login()).unwrap();
          const status = await dispatch(getLoginStatus()).unwrap();
          setLoginStatus(status);
        }
      });
    };

    initializeAuth();
  }, [user, dispatch]);
  if (auth.isError) {
    dispatch(
      setError({
        error: true,
        details: { title: "Authentication Error", message: auth.error },
      })
    );
  }
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

  const MainComponent = () => {
    switch (loginstatus) {
      case LoginStatus.NotLogged:
        return (
          <Box my={"100px"}>
            <Spinner />
          </Box>
        );
      case LoginStatus.Logged:
        return <Component />;
      case LoginStatus.Error:
        return <Unauthorised />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <Header />
      <Box minH="70vh">
        <SimpleSidebar />
        <Box ml={{ base: 0, md: 60 }} p="4">
          {MainComponent()}
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
