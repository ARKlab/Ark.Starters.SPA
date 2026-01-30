export type ApplicationInsightsConfig = {
  connectionString: string | Promise<string>
  enableClickAnalytics?: boolean
}
