import type { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import type { ComponentType } from "react";

import { appSettings } from "../../config/env";

import { stubReactPlugin } from "./index";

// Get reactPlugin synchronously - use stub if App Insights not configured
// This allows router.tsx to work at module load time
export const getReactPlugin = (): ReactPlugin => {
  // If Application Insights is not configured, return stub
  if (!appSettings.applicationInsights) {
    return stubReactPlugin;
  }
  
  // If configured, we'll lazy load the real plugin later
  // For initial module load, return stub (will be replaced when AI loads)
  return stubReactPlugin;
};

// Wrapper for withAITracking that handles both stub and real plugins
export const withAITrackingWrapper = <P extends object>(
  component: ComponentType<P>,
  componentName?: string
): ComponentType<P> => {
  const plugin = getReactPlugin();
  return withAITracking(plugin, component, componentName);
};
