import type { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import type { ApplicationInsights } from "@microsoft/applicationinsights-web"

import type { ApplicationInsightsConfig } from "./types"

// Re-export types
export type { ApplicationInsightsConfig } from "./types"

// Stub React Plugin - no-op implementation for when App Insights is not configured
// This matches the ReactPlugin interface but does nothing
export class StubReactPlugin {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(): any {
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processTelemetry(): any {
    return undefined
  }

  // Add other methods that ReactPlugin has to prevent runtime errors
  setNextPlugin() {
    // no-op
  }

  priority = 0
  identifier = "StubReactPlugin"
}

// Create a singleton stub plugin instance
export const stubReactPlugin = new StubReactPlugin() as unknown as ReactPlugin

// Type for the result of loading Application Insights
export type AppInsightsResult = {
  reactPlugin: ReactPlugin
  appInsights?: ApplicationInsights
  clickAnalyticsPlugin?: unknown
  setConsentGiven?: (value: boolean) => void
}

// Dynamic loader for Application Insights
// Returns the real reactPlugin when configured, stub when not
export async function loadApplicationInsights(
  config?: ApplicationInsightsConfig,
): Promise<AppInsightsResult> {
  if (!config) {
    return { reactPlugin: stubReactPlugin }
  }

  // Dynamically import the real implementation
  const { setupAppInsights } = await import("./setup")

  const result = setupAppInsights(config)
  return result
}
