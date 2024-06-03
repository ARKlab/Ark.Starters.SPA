import type { ReactNode } from "react";
import { createContext, useState } from "react";

export interface ILayoutContext {
    isMobileSiderOpen: boolean;
    setMobileSiderOpen: (visible: boolean) => void;
}

export const LayoutContext = createContext<ILayoutContext>({
    isMobileSiderOpen: false,
    setMobileSiderOpen: () => undefined,
});

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