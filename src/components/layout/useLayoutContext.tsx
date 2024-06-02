import { useContext } from "react";

import { LayoutContext } from "./layoutContext";



export const useLayoutContext = () => {
    const {
        isMobileSiderOpen, setMobileSiderOpen,
    } = useContext(LayoutContext);

    return {
        isMobileSiderOpen,
        setMobileSiderOpen,
    };
};
