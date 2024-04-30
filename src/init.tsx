import { useState } from "react";
import Main from "./main";
import CenterSpinner from "./components/centerSpinner";
import useAsyncEffect from "./lib/useAsyncEffect";
import { authProvider } from ".";
import useLocalizeDocumentAttributes from "./lib/i18n/useLocalizeDocumentAttributes";
import { useAppDispatch } from "./app/hooks";
import { DetectLoggedInUser } from "./lib/authentication/authenticationSlice";

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
