import { Outlet } from "react-router-dom";
import Footer from "./components/footer/footer";
import Header from "./components/header/view";

import { Box } from "@chakra-ui/react";

import SimpleSidebar from "./components/sideBar/sideBar";

import { ProblemDetailsModal } from "./components/problemDetailsModal/problemDetailsModal";
import NotificationView from "./features/notificationsSample/notificationView";
import { ErrorBoundary } from "./components/errorBoundary";

const Layout = () => {
  return (
    <>
      <Header />
      <Box minH="70vh">
        <SimpleSidebar />
        <Box ml={{ base: 0, md: 60 }} p="4" my={"70px"}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Box>
      <Footer />
      <ProblemDetailsModal />
      <NotificationView />
    </>
  );
};

export default Layout;
