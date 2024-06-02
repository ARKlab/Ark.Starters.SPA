import { Box, Center, Spinner } from "@chakra-ui/react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import { ErrorBoundary } from "./components/errorBoundary";
import Footer from "./components/footer/footer";
import Header from "./components/header/view";
import { ProblemDetailsModal } from "./components/problemDetailsModal/problemDetailsModal";
import SimpleSidebar from "./components/sideBar/sideBar";

const Layout = () => {
  return (
    <>
      <Header />
      <Box minH="70vh">
        <SimpleSidebar />
        <Box ml={{ base: 0, md: 60 }} p="4" my={'70px'}>
          <ErrorBoundary>
            <Suspense
              fallback={
                <Center minHeight="100vh">
                  <Spinner />
                </Center>
              }
            >
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </Box>
      </Box>
      <Footer />
      <ProblemDetailsModal />
    </>
  )
}

export default Layout
