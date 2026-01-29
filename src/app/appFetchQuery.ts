import type { RetryOptions } from "@reduxjs/toolkit/query"
import * as ErrorStackParser from "error-stack-parser"
import { t } from "i18next"

import type { ErrorDetailsType } from "../lib/errorHandler/errorHandler"
import type { ArkFetchBaseQueryArgs, AuthOptions } from "../lib/rtk/appFetchBaseQuery"
import { arkFetchBaseQuery } from "../lib/rtk/appFetchBaseQuery"
import { withProblemDetails } from "../lib/rtk/withProblemDetails"
import { withToaster } from "../lib/rtk/withToaster"
import { withZodResultValidation } from "../lib/rtk/withZodResultValidation"

export const appFetchQuery = (
  fetchConfig?: ArkFetchBaseQueryArgs,
  appConfig?: {
    retryConfig?: RetryOptions
    authConfig?: AuthOptions
  },
) =>
  withToaster(
    withZodResultValidation(withProblemDetails(arkFetchBaseQuery(fetchConfig, appConfig))),
    {
      toDetails: ({ error }) => {
        const ed = ((): ErrorDetailsType => {
          if (error.status === "PROBLEM_DETAILS_ERROR")
            return {
              details: JSON.stringify(error.problemDetails, null, 2),
              title: error.problemDetails.title,
              message: error.problemDetails.detail,
              status: error.problemDetails.status?.toString(),
              traceId: error.problemDetails.instance,
            }

          if (
            error.status === "ZOD_SCHEMA_ERROR" ||
            error.status === "PARSING_ERROR" ||
            error.status === "FETCH_ERROR" ||
            error.status === "CUSTOM_ERROR" ||
            error.status === "TIMEOUT_ERROR"
          ) {
            // HACK: error.error is often new String(error). if the assumption is true, reconstruct the stack. The library is going to 'skip' non-stack lines
            const st = ErrorStackParser.parse({ stack: error.error } as Error)

            let stack = undefined,
              details = undefined

            // errors to have have a 'stack' must have at least 2 lines, the first would be the message details
            if (st.length > 1 && st[0].source) {
              const idx = error.error.indexOf(st[0].source)
              stack = error.error
              details = error.error.substring(0, idx)
            } else {
              details = error.error
            }

            return {
              title:
                error.status === "TIMEOUT_ERROR"
                  ? t("template:errorHandler.timeout")
                  : t("template:errorHandler.error"),
              message: t("template:errorHandler.contactAdministrator"),
              details: details,
              stack: stack,
            }
          }

          return {
            title: t("template:errorHandler.error"),
            message: t("template:errorHandler.contactAdministrator"),
            details: JSON.stringify(error.data, null, 2),
          }
        })()

        return ed
      },
    },
  )
