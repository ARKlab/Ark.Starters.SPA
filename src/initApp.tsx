import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { useRef, useState } from "react";

import { useAppDispatch } from "./app/hooks";
import CenterSpinner from "./components/centerSpinner";
import { appSettings } from "./config/env";
import { reactPlugin, setupAppInsights } from "./lib/applicationInsights";
import { DetectLoggedInUser } from "./lib/authentication/authenticationSlice";
import { useAuthContext } from "./lib/authentication/components/useAuthContext";
import { i18nSetup } from "./lib/i18n/setup";
import useAsyncEffect from "./lib/useAsyncEffect";
import Main from "./main";

export function InitApp() {
  const ref = useRef<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [appInsightsPlugin, setAppInsightsPlugin] = useState(reactPlugin);

  const dispatch = useAppDispatch();
  const { context } = useAuthContext();

  useAsyncEffect(async () => {
    if (ref.current) return;
    ref.current = true; // only once

    if (import.meta.env.DEV || import.meta.env.MODE === "e2e") {
      const { worker } = await import("./lib/mocks/browserWorker");
      await worker.start({
        onUnhandledRequest: request => {
          // Don't warn about Auth0 requests
          if (request.url.includes("auth0.com")) {
            return;
          }
          console.warn(
            "[MSW] Warning: intercepted a request without a matching request handler:",
            request.method,
            request.url,
          );
        },
      });
    }

    if (appSettings.applicationInsights) {
      const { reactPlugin: aiPlugin } = setupAppInsights(appSettings.applicationInsights);
      setAppInsightsPlugin(aiPlugin);
    }

    await i18nSetup();

    await context.init();
    await dispatch(DetectLoggedInUser());

    window.appReady = true;

    setLoading(false);
  }, [dispatch, setLoading]);

  if (loading) return <CenterSpinner />;

  return (
    <>
      <AppInsightsContext.Provider value={appInsightsPlugin}>
        <Main />
      </AppInsightsContext.Provider>
    </>
  );
}
