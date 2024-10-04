import { Grid, GridItem } from "@chakra-ui/react";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import CenterSpinner from "../centerSpinner";
import { ErrorBoundary } from "../errorBoundary";
import { GdprConsentDialog } from "../gdprConsentDialog";
import { ProblemDetailsModal } from "../problemDetailsModal/problemDetailsModal";

import Header from "./header/view";
import { LayoutContextProvider } from "./layoutContext";
import SimpleSidebar from "./sideBar/sideBar";

const Layout = () => {
  return (
    <LayoutContextProvider>
      <Grid
        h={'100vh'}
        w={'100vw'}
        gridTemplateAreas={`'header header'
                            'nav content'
                            `}
        gridTemplateColumns={'auto 1fr'}
        gridTemplateRows={'4rem 1fr auto'}
      >
        <GridItem area={'header'} position={'sticky'} top={0} left={0} zIndex={'banner'}>
          <Header />
        </GridItem>

        <GridItem area={'nav'} position={'sticky'} left={0} top={'4rem'} zIndex={'banner'} overflowY={'auto'} overflowX={'hidden'}>
          <SimpleSidebar />
        </GridItem>


        <GridItem area={'content'} as={'main'} p={4} overflow={'auto'}>
          <ErrorBoundary>
            <Suspense
              fallback={
                <CenterSpinner />
              }
            >
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </GridItem>


      </Grid>

      <ProblemDetailsModal />
      <GdprConsentDialog />
    </LayoutContextProvider>
  )
}

export default Layout
