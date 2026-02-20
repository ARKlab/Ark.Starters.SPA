import type { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import type { ApplicationInsights } from "@microsoft/applicationinsights-web"
import { createContext, useContext } from "react"

import { stubReactPlugin } from "./index"

// Context to hold the current reactPlugin instance
// This allows components to re-render when the real plugin is loaded
export const ReactPluginContext = createContext<ReactPlugin>(stubReactPlugin)

// Hook to access the current reactPlugin
export const useReactPlugin = (): ReactPlugin => {
  return useContext(ReactPluginContext)
}

// Context to hold the ApplicationInsights facade instance
// This is the full facade that exposes setAuthenticatedUserContext and other top-level APIs
// Undefined when Application Insights is not configured
export const AppInsightsInstanceContext = createContext<ApplicationInsights | undefined>(undefined)
