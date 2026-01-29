import { useContext } from "react"

import { LayoutContext } from "./layoutContext"

export const useLayoutContext = () => {
  const { isDesktop, isMobileSiderOpen, setMobileSiderOpen } = useContext(LayoutContext)

  return {
    isDesktop,
    isMobileSiderOpen,
    setMobileSiderOpen,
  }
}
