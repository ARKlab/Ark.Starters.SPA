import { useEffect, useRef, useState } from "react"

import { useCookieConsent } from "../useGDPRConsent"

import type { AppInsightsResult, ApplicationInsightsConfig } from "./index"
import { loadApplicationInsights, stubReactPlugin } from "./index"

/**
 * Loads ApplicationInsights only after GDPR statistics cookie consent is given.
 * Before consent (or after rejection), a Noop stub is used.
 *
 * Decision matrix:
 * - Consent given + connectionString present → real ApplicationInsights
 * - Consent given + connectionString absent → Noop stub
 * - Consent not given → Noop stub
 * - Consent given + e2e mode → e2e-configured ApplicationInsights (handled by setup.ts)
 */
export function useAppInsightsCookieConsent(config?: ApplicationInsightsConfig): AppInsightsResult {
  const [consent] = useCookieConsent()
  const [result, setResult] = useState<AppInsightsResult>({ reactPlugin: stubReactPlugin })
  const loadedRef = useRef(false)

  const statisticsAccepted = consent?.statistics === true

  useEffect(() => {
    if (!config || !statisticsAccepted || loadedRef.current) return

    loadedRef.current = true
    void loadApplicationInsights(config).then(aiResult => {
      if (aiResult.appInsights) {
        aiResult.appInsights.getCookieMgr().setEnabled(true)
      }
      setResult(aiResult)

      // Expose appInsights instance on window for E2E tests
      if (import.meta.env.MODE === "e2e" && aiResult.appInsights) {
        window.appInsights = aiResult.appInsights
      }
    })
  }, [config, statisticsAccepted])

  return result
}
