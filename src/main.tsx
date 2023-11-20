import { Navigate, Route, Routes } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import Header from "./components/header/view";
import Unauthorised from "./unauthorised/view";
import Footer from "./components/footer/footer";
import { useTranslate } from "./translate";
import { useSelector } from "react-redux";
import { Selectors as errorSelectors } from "./redux/modules/errorHandler";
import {
  notificationResetNotificationAction,
  Selectors as notificationSelector,
} from "./redux/modules/common/notification";

import { Box } from "@chakra-ui/react";

import SimpleSidebar from "./components/sideBar/sideBar";

import { useDispatch } from "react-redux";

import { ProblemDetailsModal } from "./componentsCommon/problemDetailsModal/problemDetailsModal";

const Component = () => {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Navigate to="/edm/manualUpload" />} />
        <Route path="/Unauthorized" element={<Unauthorised />} />
        <Route path="/main/Test/" element={<></>} />

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
  const problemDetails = useSelector(errorSelectors.all);
  const notification = useSelector(notificationSelector.all).notification;
  const dispatch = useDispatch();
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
        dispatch(notificationResetNotificationAction())}
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
