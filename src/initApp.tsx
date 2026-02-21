import { AppInsightsContext } from "@microsoft/applicationinsights-react-js"
import { useRef, useState } from "react"

import { useAppDispatch } from "./app/hooks"
import CenterSpinner from "./components/centerSpinner"
import { appSettings } from "./config/env"
import { ReactPluginContext } from "./lib/applicationInsights/context"
import { useAppInsightsCookieConsent } from "./lib/applicationInsights/useAppInsightsCookieConsent"
import { DetectLoggedInUser } from "./lib/authentication/authenticationSlice"
import { useAuthContext } from "./lib/authentication/components/useAuthContext"
import { i18nSetup } from "./lib/i18n/setup"
import useAsyncEffect from "./lib/useAsyncEffect"
import Main from "./main"

export function InitApp() {
  const ref = useRef<boolean>(false)
  const [loading, setLoading] = useState(true)

  // ApplicationInsights is loaded only after GDPR statistics cookie consent is given.
  // Before consent, a Noop stub is used so the rest of the app works normally.
  const { reactPlugin } = useAppInsightsCookieConsent(appSettings.applicationInsights)

  const dispatch = useAppDispatch()
  const { context } = useAuthContext()

  useAsyncEffect(async () => {
    if (ref.current) return
    ref.current = true // only once

    if (import.meta.env.DEV || import.meta.env.MODE === "e2e") {
      const { worker } = await import("./lib/mocks/browserWorker")
      await worker.start({ onUnhandledRequest: "warn" })
    }

    await i18nSetup()

    await context.init()
    await dispatch(DetectLoggedInUser())

    window.appReady = true

    setLoading(false)
  }, [dispatch, setLoading])

  if (loading) return <CenterSpinner />

  return (
    <ReactPluginContext.Provider value={reactPlugin}>
      <AppInsightsContext.Provider value={reactPlugin}>
        <Main />
      </AppInsightsContext.Provider>
    </ReactPluginContext.Provider>
  )
}
