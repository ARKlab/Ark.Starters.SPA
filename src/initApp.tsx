import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import type { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { useRef, useState } from "react";

import { useAppDispatch } from "./app/hooks";
import CenterSpinner from "./components/centerSpinner";
import { appSettings } from "./config/env";
import { loadApplicationInsights, stubReactPlugin } from "./lib/applicationInsights";
import { ReactPluginContext } from "./lib/applicationInsights/context";
import { DetectLoggedInUser } from "./lib/authentication/authenticationSlice";
import { useAuthContext } from "./lib/authentication/components/useAuthContext";
import { i18nSetup } from "./lib/i18n/setup";
import useAsyncEffect from "./lib/useAsyncEffect";
import Main from "./main";

export function InitApp() {
    const ref = useRef<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [reactPlugin, setReactPlugin] = useState<ReactPlugin>(stubReactPlugin);

    const dispatch = useAppDispatch();
    const { context } = useAuthContext();

    useAsyncEffect(async () => {
        if (ref.current) return;
        ref.current = true; // only once

        if (import.meta.env.DEV || import.meta.env.MODE === "e2e") {
            const { worker } = await import('./lib/mocks/browserWorker');
            await worker.start({ onUnhandledRequest: "warn" });

        }

        // Conditionally load Application Insights only when configured
        const aiResult = await loadApplicationInsights(appSettings.applicationInsights);
        setReactPlugin(aiResult.reactPlugin);

        await i18nSetup();

        await context.init();
        await dispatch(DetectLoggedInUser());

        window.appReady = true;

        setLoading(false);
    }, [dispatch, setLoading]);

    if (loading) return (<CenterSpinner />);

    return (
        <ReactPluginContext.Provider value={reactPlugin}>
            <AppInsightsContext.Provider value={reactPlugin}>
                <Main />
            </AppInsightsContext.Provider>
        </ReactPluginContext.Provider>
    );
}
