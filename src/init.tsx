import { useState } from "react";

import { useAppDispatch } from "./app/hooks";
import CenterSpinner from "./components/centerSpinner";
import { authProvider } from "./globalConfigs";
import { DetectLoggedInUser } from "./lib/authentication/authenticationSlice";
import useLocalizeDocumentAttributes from "./lib/i18n/useLocalizeDocumentAttributes";
import useAsyncEffect from "./lib/useAsyncEffect";
import Main from "./main";

export function Init() {
    const [v, setValue] = useState(true);
    useLocalizeDocumentAttributes();
    const dispatch = useAppDispatch();

    useAsyncEffect(async () => {
        await authProvider.init();
        await dispatch(DetectLoggedInUser());
        setValue(false);
    }, [setValue]);

    if (v) return (<CenterSpinner />);

    return (
        <Main />
    );
}
