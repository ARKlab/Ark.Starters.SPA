import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'

import Footer from './components/footer/footer'
import Header from './components/header/view'
import SimpleSidebar from './components/sideBar/sideBar'
import { ErrorBoundary } from './componentsCommon/errorBoundary'
import { ProblemDetailsModal } from './componentsCommon/problemDetailsModal/problemDetailsModal'
import NotificationView from './features/notifications/notificationView'

const Layout = () => {
  return (
    <>
      <Header />
      <Box minH="70vh">
        <SimpleSidebar />
        <Box ml={{ base: 0, md: 60 }} p="4" my={'70px'}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </Box>
      </Box>
      <Footer />
      <ProblemDetailsModal />
      <NotificationView />
    </>
  )
}

export default Layout
