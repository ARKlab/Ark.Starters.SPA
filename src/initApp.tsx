import { useRef, useState } from "react";

import { useAppDispatch } from "./app/hooks";
import CenterSpinner from "./components/centerSpinner";
import { DetectLoggedInUser } from "./lib/authentication/authenticationSlice";
import { useAuthContext } from "./lib/authentication/components/useAuthContext";
import { i18nSetup } from "./lib/i18n/setup";
import useAsyncEffect from "./lib/useAsyncEffect";
import Main from "./main";

export function InitApp() {
    const ref = useRef<boolean>(false);
    const [loading, setLoading] = useState(true);

    const dispatch = useAppDispatch();
    const { context } = useAuthContext();

    useAsyncEffect(async () => {
        if (ref.current) return;
        ref.current = true; // only once

        if (import.meta.env.DEV) {
            const { worker } = await import('./lib/mocks/browserWorker');
            await worker.start({ onUnhandledRequest: "error" });
        }

        await i18nSetup();
        await context.init();
        await dispatch(DetectLoggedInUser());

        if (window.Cypress)
            window.appReady = true;

        setLoading(false);
    }, [dispatch, setLoading]);

    if (loading) return (<CenterSpinner />);

    return (<>
        <Main />
    </>

    );
}
