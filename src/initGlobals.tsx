import { useState, useEffect } from "react";
import { Provider } from "react-redux";

import { initStore, getResetApiActions } from "./app/configureStore";
import CenterSpinner from "./components/centerSpinner";
import { getAuthProvider } from "./config/authProvider";
import { InitApp } from "./initApp";
import AuthenticationProviderContext from "./lib/authentication/components/AuthenticationProviderContext";
import type { AuthProvider } from "./lib/authentication/providers/authProviderInterface";
import { setError } from "./lib/errorHandler/errorHandler";

// this component, to be loaded as LazyLoad, is required to move the import of the authProvider
// which depends on 'window.appSettings' so that in case the appSettings are wrong
// A BLANK PAGE is avoided as exceptions from here are captured in the ErrorBoundary of the Index
const InitGlobals = () => {
  const [authProvider, setAuthProvider] = useState<AuthProvider | null>(null);
  const [store, setStore] = useState<ReturnType<typeof initStore> | null>(null);

  useEffect(() => {
    // Load auth provider and initialize store
    void getAuthProvider().then(provider => {
      setAuthProvider(provider);
      
      const newStore = initStore({ authProvider: provider });
      setStore(newStore);

      if (import.meta.env.DEV || import.meta.env.MODE === "e2e") {
        window.rtkq = {
          resetCache: () => {
            for (const x of getResetApiActions())
              newStore.dispatch(x);
          }
        }
      }

      // This is needed in case someone uses useEffect() for ASYNC promised instead of useAsyncEffect()
      window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
        newStore.dispatch(setError({
          error: true,
          details: {
            title: "unhandled promise rejection",
            message: e.reason?.message,
            status: e.reason?.code,
            stack: e.reason?.stack
          },
        }))
      });
    });
  }, []);

  // Show loading spinner while auth provider is being loaded
  if (!authProvider || !store) {
    return <CenterSpinner />;
  }

  return (
    <AuthenticationProviderContext authProvider={authProvider}>
      <Provider store={store}>
        <InitApp />
      </Provider>
    </AuthenticationProviderContext>
  );
}

export default InitGlobals;
