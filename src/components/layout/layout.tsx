import { Grid, GridItem } from "@chakra-ui/react"
import { Suspense } from "react"
import { Outlet } from "react-router"

import { AppErrorModal } from "../../lib/components/AppErrorModal/appErrorModal"
import CenterSpinner from "../centerSpinner"
import { ErrorBoundary } from "../errorBoundary"
import { GdprConsentDialog } from "../gdprConsentDialog"
import { Toaster } from "../ui/toaster"

import Header from "./header/view"
import { LayoutContextProvider } from "./LayoutContextProvider"
import SimpleSidebar from "./sideBar/sideBar"

const Layout = () => {
  return (
    <LayoutContextProvider>
      <Grid
        h="vh"
        w="vw"
        gridTemplateAreas={`'header header'
                            'nav content'
                            `}
        gridTemplateColumns={"16rem 1fr"}
        gridTemplateRows={"4rem 1fr auto"}
      >
        <GridItem area={"header"} position={"sticky"} top="0" left="0" zIndex={"banner"}>
          <Header />
        </GridItem>

        <GridItem
          area={"nav"}
          position={"sticky"}
          left="0"
          top="16"
          zIndex={"banner"}
          overflowY={"auto"}
          overflowX={"hidden"}
        >
          <SimpleSidebar />
        </GridItem>

        <GridItem area={"content"} as={"main"} p="4" overflow={"auto"} bg={"bg"}>
          <ErrorBoundary>
            <Suspense fallback={<CenterSpinner />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </GridItem>
      </Grid>

      <AppErrorModal />
      <GdprConsentDialog />
      <Toaster />
    </LayoutContextProvider>
  )
}

export default Layout
