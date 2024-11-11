import { type ReactNode, useState } from "react";

import { LayoutContext } from "./layoutContext";


export const LayoutContextProvider = ({ children }: {
    children: ReactNode;
}) => {

    const [isMobileSiderOpen, setMobileSiderOpen] = useState(false);

    return (
        <LayoutContext.Provider
            value={{
                isMobileSiderOpen,
                setMobileSiderOpen,
            }}
        >
            {children}
        </LayoutContext.Provider>
    );
};
