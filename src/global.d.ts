import type { ApplicationInsights } from "@microsoft/applicationinsights-web"
import type { http } from "msw"
import { type SetupWorker } from "msw/browser"
import { type Router } from "react-router"

declare global {
  interface Window {
    msw:
      | {
          worker: SetupWorker
          http: typeof http
        }
      | undefined
    rtkq:
      | {
          resetCache: () => void
        }
      | undefined
    Cypress: object | undefined
    router: Router
    appReady: boolean
    appInsights: ApplicationInsights | undefined
  }
}
