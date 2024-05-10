import { useState } from "react";

import { useAppDispatch } from "./app/hooks";
import CenterSpinner from "./components/centerSpinner";
import { authProvider } from "./globalConfigs";
import { DetectLoggedInUser } from "./lib/authentication/authenticationSlice";
import { i18nSetup } from "./lib/i18n/config";
import useAsyncEffect from "./lib/useAsyncEffect";
import Main from "./main";

export function Init() {
    const [v, setValue] = useState(true);
    const dispatch = useAppDispatch();

    useAsyncEffect(async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await i18nSetup();
        await authProvider.init();
        await dispatch(DetectLoggedInUser());
        setValue(false);
    }, [setValue]);

    if (v) return (<CenterSpinner />);

    return (<>
        <Main />
    </>
    );
}
