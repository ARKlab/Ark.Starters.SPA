import { LocaleProvider } from "@chakra-ui/react"
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js"
import type { IApplicationInsights } from "@microsoft/applicationinsights-web"
import { Suspense, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { RouterProvider } from "react-router"

import { useAppSelector } from "./app/hooks"
import CenterSpinner from "./components/centerSpinner"
import { PWABadge } from "./components/pwaBadge"
import { userSelector } from "./lib/authentication/authenticationSlice"
import useLocalizeDocumentAttributes from "./lib/i18n/useLocalizeDocumentAttributes"
import { router } from "./lib/router"

const Main = () => {
  useLocalizeDocumentAttributes()
  const { i18n } = useTranslation()

  const user = useAppSelector(userSelector)

  const ai = useAppInsightsContext()

  useEffect(() => {
    if (user) {
      const appInsights = ai.getAppInsights() as IApplicationInsights | undefined
      appInsights?.setAuthenticatedUserContext(user.username)
    }
  }, [user, ai])

  return (
    <>
      <LocaleProvider locale={i18n.language}>
        <Suspense fallback={<CenterSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
        <PWABadge />
      </LocaleProvider>
    </>
  )
}

export default Main
