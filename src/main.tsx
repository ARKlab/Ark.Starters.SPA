import { LocaleProvider } from "@chakra-ui/react"
import { Suspense, useContext, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { RouterProvider } from "react-router"

import { useAppSelector } from "./app/hooks"
import CenterSpinner from "./components/centerSpinner"
import { PWABadge } from "./components/pwaBadge"
import { AppInsightsInstanceContext } from "./lib/applicationInsights/context"
import { userSelector } from "./lib/authentication/authenticationSlice"
import useLocalizeDocumentAttributes from "./lib/i18n/useLocalizeDocumentAttributes"
import { router } from "./lib/router"

const Main = () => {
  useLocalizeDocumentAttributes()
  const { i18n } = useTranslation()

  const user = useAppSelector(userSelector)

  const appInsights = useContext(AppInsightsInstanceContext)

  useEffect(() => {
    if (user && appInsights) {
      appInsights.setAuthenticatedUserContext(user.username)
    }
  }, [user, appInsights])

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
