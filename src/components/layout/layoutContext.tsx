import { createContext } from "react";

export interface ILayoutContext {
    isMobileSiderOpen: boolean;
    setMobileSiderOpen: (visible: boolean) => void;
}

export const LayoutContext = createContext<ILayoutContext>({
    isMobileSiderOpen: false,
    setMobileSiderOpen: () => undefined,
});

