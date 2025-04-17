import { useBreakpointValue } from "@chakra-ui/react";
import { type ReactNode, useState } from "react";

import { LayoutContext } from "./layoutContext";


export const LayoutContextProvider = ({ children }: {
    children: ReactNode;
}) => {

    const [isMobileSiderOpen, setMobileSiderOpen] = useState(false);

    const isDesktop = useBreakpointValue({ base: false, lg: true });

    return (
        <LayoutContext.Provider
            value={{
                isDesktop: isDesktop ?? true,
                isMobileSiderOpen,
                setMobileSiderOpen,
            }}
        >
            {children}
        </LayoutContext.Provider >
    );
};
