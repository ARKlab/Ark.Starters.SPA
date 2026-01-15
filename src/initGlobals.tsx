import { Provider } from "react-redux";

import { initStore, getResetApiActions } from "./app/configureStore";
import { authProvider } from "./config/authProvider"; // this could fail if 'env' is malconfigured as is env-dependent
import { InitApp } from "./initApp";
import AuthenticationProviderContext from "./lib/authentication/components/AuthenticationProviderContext";
import { setError } from "./lib/errorHandler/errorHandler";

const store = initStore({ authProvider })

if (import.meta.env.DEV || import.meta.env.MODE === "e2e") {
  window.rtkq = {
    resetCache: () => {
      for (const x of getResetApiActions())
        store.dispatch(x);
    }
  }
}

// This is needed in case someone uses useEffect() for ASYNC promised instead of useAsyncEffect()
window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
  store.dispatch(setError({
    error: true,
    details: {
      title: "unhandled promise rejection",
      message: e.reason?.message,
      status: e.reason?.code,
      stack: e.reason?.stack
    },
  }))
});

// this component, to be loaded as LazyLoad, is required to move the import of the authProvider
// which depends on 'window.appSettings' so that in case the appSettings are wrong
// A BLANK PAGE is avoided as exceptions from here are captured in the ErrorBoundary of the Index
const InitGlobals = () => {
  return (
    <AuthenticationProviderContext authProvider={authProvider}>
      <Provider store={store}>
        <InitApp />
      </Provider>
    </AuthenticationProviderContext>
  );
}

export default InitGlobals;


