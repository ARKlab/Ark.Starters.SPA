import type { ApplicationInsights } from "@microsoft/applicationinsights-web"
import { useEffect } from "react"

import { useCookieConsent } from "../useGDPRConsent"

/**
 * Connects ApplicationInsights telemetry to GDPR cookie consent.
 * Telemetry and cookies are enabled only when the user accepts statistics cookies.
 */
export function useAppInsightsCookieConsent(
  appInsights: ApplicationInsights | undefined,
  setConsentGiven: ((value: boolean) => void) | undefined,
) {
  const [consent] = useCookieConsent()

  useEffect(() => {
    if (!appInsights || !setConsentGiven) return

    const statisticsAccepted = consent?.statistics === true

    setConsentGiven(statisticsAccepted)
    appInsights.getCookieMgr().setEnabled(statisticsAccepted)
  }, [appInsights, setConsentGiven, consent?.statistics])
}
