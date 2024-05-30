import { useState } from "react";

import { useAppDispatch } from "./app/hooks";
import CenterSpinner from "./components/centerSpinner";
import { DetectLoggedInUser } from "./lib/authentication/authenticationSlice";
import { useAuthContext } from "./lib/authentication/components/useAuthContext";
import { i18nSetup } from "./lib/i18n/config";
import useAsyncEffect from "./lib/useAsyncEffect";
import Main from "./main";



export function InitApp() {
    const [v, setValue] = useState(true);
    const dispatch = useAppDispatch();
    const { context } = useAuthContext();

    useAsyncEffect(async () => {
        if (!v) return;
        await i18nSetup();
        await context.init();
        await dispatch(DetectLoggedInUser());
        setValue(false);
    }, [v, setValue]);

    if (v) return (<CenterSpinner />);

    return (<>
        <Main />
    </>

    );
}
