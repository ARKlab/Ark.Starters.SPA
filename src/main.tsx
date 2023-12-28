import { Navigate, Route, Routes } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import Header from "./components/header/view";
import Unauthorised from "./unauthorised/view";
import Footer from "./components/footer/footer";
import { Selectors as errorSelectors } from "./redux/modules/errorHandler";
import {
  resetNotification,
  selectNotification,
} from "./redux/modules/common/notification";

import { Box } from "@chakra-ui/react";

import SimpleSidebar from "./components/sideBar/sideBar";

import { ProblemDetailsModal } from "./componentsCommon/problemDetailsModal/problemDetailsModal";
import TestPage from "./components/testComponents/TestPage";
import { useAppDispatch, useAppSelector } from "./app/hooks";

const Component = () => {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Navigate to="/test" />} />
        <Route path="/Unauthorized" element={<Unauthorised />} />
        <Route path="/test" element={<TestPage />} />

        {
          //Understand why with this method :params in path are not being recognized.
          /*mainSections.map((x) =>
          x.subsections.map((s) => (
            <Route path={s.path} element={s.component({ a: dispatch })} />
          ))
        )*/
        }
      </Routes>
    </>
  );
};

const Main = () => {
  const problemDetails = useAppSelector(errorSelectors.all);
  const notification = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  var toast = useToast();
  return (
    <>
      <Header />
      <Box minH="70vh">
        <SimpleSidebar />
        <Box ml={{ base: 0, md: 60 }} p="4">
          <Component />
        </Box>
      </Box>
      {notification &&
        toast({
          title: notification.title,
          description: notification.message,
          status: notification.status,
          duration: notification.duration,
          isClosable: notification.isClosable,
        }) &&
        dispatch(resetNotification())}
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
