import {
  Center,
  ChakraProvider,
  Spinner,
  createLocalStorageManager,
} from '@chakra-ui/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'

import { initStore } from './app/configureStore'
import SEO from './componentsCommon/seo'
import Auth0AuthProvider from './lib/authentication/auth0AuthProvider'
import AuthenticationProviderContext from './lib/authentication/AuthenticationProviderContext'
import Main from './main'
import reportWebVitals from './reportWebVitals'
import { theme } from './theme'

import './lib/i18n/config'

const env = window.customSettings
const authProvider = new Auth0AuthProvider(env)

const store = initStore(authProvider)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
setupListeners(store.dispatch)

/**
 * ReactErrorBoundary at this level renders a Chakra-less/Redux-less context as they failed.
 * A nicer ReactErrorBoundary is used by the Application's Layout so this is really a last resort
 * for the user to take a screenshot and send to someone.
 * The only alternative would be an blank-page, which isn't nicer ...
 *
 * Important: use only basic DOM/Style, UI Toolkit nor ReduxToolkit are available!
 */
function fallbackRender({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Fatal error. Reload the Browser (F5)</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <pre style={{ color: 'red' }}>{error.stack}</pre>
    </div>
  )
}

async function initApplication() {
  await authProvider.init()
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  )
  const colorModeManager = createLocalStorageManager(
    import.meta.env.VITE_APP_TITLE + '-ColorMode',
  ) //change the name of the application

  root.render(
    <React.StrictMode>
      <ReactErrorBoundary fallbackRender={fallbackRender}>
        <AuthenticationProviderContext authProvider={authProvider}>
          <Provider store={store}>
            <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
              <HelmetProvider>
                <SEO
                  title={import.meta.env.VITE_APP_TITLE}
                  description={import.meta.env.VITE_APP_DESCRIPTION}
                  name={import.meta.env.VITE_APP_COMPANY}
                />
                <Suspense
                  fallback={
                    <Center minHeight="100vh">
                      <Spinner />
                    </Center>
                  }
                >
                  <Main />
                </Suspense>
              </HelmetProvider>
            </ChakraProvider>
          </Provider>
        </AuthenticationProviderContext>
      </ReactErrorBoundary>
    </React.StrictMode>,
  )

  reportWebVitals()
}

//
window.addEventListener('vite:preloadError', () => {
  window.location.reload()
})

initApplication()
