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
    ref.current = true;

    if (import.meta.env.DEV || import.meta.env.MODE === "e2e") {
      const { worker } = await import("./lib/mocks/browserWorker");
      await worker.start({
        onUnhandledRequest: request => {
          if (request.url.includes("auth0.com")) {
            return "bypass";
          }
          if (request.url.includes("localhost") && request.url.includes("/api/")) {
            return "bypass";
          }
          if (request.url.includes("k4view-admin-test-k2e.azurewebsites.net")) {
            return "bypass";
          }
          if (request.url.includes("k4view-portal-test-k2e.azurewebsites.net")) {
            return "bypass";
          }
          if (request.url.includes("k4view-artesian-useradmin-test.azurewebsites.net")) {
            console.warn("[MSW] Artesian request not handled by mock:", request.method, request.url);
            return "bypass";
          }
          console.warn(
            "[MSW] Warning: intercepted a request without a matching request handler:",
            request.method,
            request.url,
          );
          return "bypass";
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
