import { Navigate, Route, Routes } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import Header from "./components/header/view";
import Unauthorised from "./features/unauthorised/view";
import Footer from "./components/footer/footer";
import { Selectors as errorSelectors } from "./features/errorHandler/errorHandler";
import {
  resetNotification,
  selectNotification,
} from "./features/notifications/notification";

import { Box } from "@chakra-ui/react";

import SimpleSidebar from "./components/sideBar/sideBar";

import { ProblemDetailsModal } from "./componentsCommon/problemDetailsModal/problemDetailsModal";
import JsonPlaceHolderView from "./features/jsonPlaceholderAPI/JsonPlaceHolder";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import PlaygroundView from "./features/playground/playgroundView";
import ConfigTableExampleView from "./features/configTable/configTableExample";
import MovieTableView from "./features/paginatedTable/moviePage";
import VideoGamesTableView from "./features/formExample/videoGamesPage";
import { mainSections } from "./siteMap/mainSections";
import { useEffect } from "react";

const Component = () => {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Navigate to="/test" />} />
        <Route path="/Unauthorized" element={<Unauthorised />} />
        {mainSections.map((x) =>
          x.subsections.map((s) =>
            s.component ? <Route path={s.path} element={s.component()} /> : null
          )
        )}
      </Routes>
    </>
  );
};

const Main = () => {
  const problemDetails = useAppSelector(errorSelectors.all);
  const notification = useAppSelector(selectNotification);
  const dispatch = useAppDispatch();
  var toast = useToast();
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
          <Component />
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
