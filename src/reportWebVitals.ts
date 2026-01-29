import type { IApplicationInsights } from "@microsoft/applicationinsights-web"
import type { Metric } from "web-vitals"

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals")
      .then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        onCLS(onPerfEntry)
        onFCP(onPerfEntry)
        onLCP(onPerfEntry)
        onTTFB(onPerfEntry)
        onINP(onPerfEntry)
      })
      .catch(console.error)
  }
}

/**
 * Send Web Vitals metrics to Application Insights
 * @param metric - Web Vitals metric object
 * @param appInsights - Application Insights instance (optional, will be retrieved from window if not provided)
 */
export const sendToAnalytics = (metric: Metric, appInsights?: IApplicationInsights) => {
  // Log in development mode for debugging
  if (import.meta.env.DEV) {
    console.log("[Web Vitals]", metric)
  }

  // Send to Application Insights if available
  // The appInsights instance is attached to window after initialization in initApp.tsx
  const ai = appInsights ?? (window as Window & { appInsights?: IApplicationInsights }).appInsights

  if (ai) {
    ai.trackMetric({
      name: metric.name,
      average: metric.value,
      properties: {
        id: metric.id,
        navigationType: metric.navigationType,
        rating: metric.rating,
      },
    })
  }
}

export default reportWebVitals
