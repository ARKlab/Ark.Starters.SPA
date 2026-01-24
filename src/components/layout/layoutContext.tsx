import { createContext } from "react"

export interface ILayoutContext {
  isDesktop: boolean
  isMobileSiderOpen: boolean
  setMobileSiderOpen: (visible: boolean) => void
}

export const LayoutContext = createContext<ILayoutContext>({
  isDesktop: true,
  isMobileSiderOpen: false,
  setMobileSiderOpen: () => undefined,
})
