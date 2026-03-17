import type { ApplicationInsights } from "@microsoft/applicationinsights-web"
import type { http } from "msw"
import { type SetupWorker } from "msw/browser"
import { type Router } from "react-router"

import type { UserAccountInfo } from "./lib/authentication/authTypes"

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
    /** Fake authenticated user injected by e2e tests via `onBeforeLoad` */
    e2eUser?: UserAccountInfo
  }
}
