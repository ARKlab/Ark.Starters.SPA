import type { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import { createContext, useContext } from "react"

import { stubReactPlugin } from "./index"

// Context to hold the current reactPlugin instance
// This allows components to re-render when the real plugin is loaded
export const ReactPluginContext = createContext<ReactPlugin>(stubReactPlugin)

// Hook to access the current reactPlugin
export const useReactPlugin = (): ReactPlugin => {
  return useContext(ReactPluginContext)
}
