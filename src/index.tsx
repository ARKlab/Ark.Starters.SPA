import {
  ChakraProvider,
  createLocalStorageManager,
} from "@chakra-ui/react";
import { setupListeners } from "@reduxjs/toolkit/query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { initStore } from "./app/configureStore";
import reportWebVitals from "./reportWebVitals";
import { theme } from "./theme";

import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import "./lib/i18n/config";
import AuthenticationProviderContext from "./lib/authentication/components/AuthenticationProviderContext";
import SEO from "./components/seo";
import { setError } from "./lib/errorHandler/errorHandler";
import { Init } from "./init";
import { MsalAuthProvider } from "./lib/authentication/providers/msalAuthProvider";

const env = window.customSettings;
export const authProvider = new MsalAuthProvider(env);

const store = initStore(authProvider);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);

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
      <pre style={{ color: "red" }}>{error.message}</pre>
      <pre style={{ color: "red" }}>{error.stack}</pre>
    </div>
  );
}

window.addEventListener("vite:preloadError", () => {
  window.location.reload();
});

// This is needed in case someone uses useEffect() for ASYNC promised instead of useAsyncEffect()
window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
  store.dispatch(setError({
    error: true,
    details: {
      title: "unhandled promise rejection",
      message: e.reason?.message,
      status: e.reason?.code,
      isValidationError: false
    },
  }))
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const colorModeManager = createLocalStorageManager(
  import.meta.env.VITE_APP_TITLE + "-ColorMode"
); //change the name of the application

root.render(
  <React.StrictMode>
    <ReactErrorBoundary fallbackRender={fallbackRender}>
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        <AuthenticationProviderContext authProvider={authProvider}>
          <Provider store={store}>
            <HelmetProvider>
              <SEO
                title={import.meta.env.VITE_APP_TITLE}
                description={import.meta.env.VITE_APP_DESCRIPTION}
                name={import.meta.env.VITE_APP_COMPANY}
              />
              <Init />
            </HelmetProvider>
          </Provider>
        </AuthenticationProviderContext>
      </ChakraProvider>
    </ReactErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();

