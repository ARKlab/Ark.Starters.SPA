/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ThunkDispatch } from "@reduxjs/toolkit"
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { fetchBaseQuery, retry } from "@reduxjs/toolkit/query"
import type {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  RetryOptions,
} from "@reduxjs/toolkit/query"
import { parse } from "@tinyhttp/content-disposition"

import type { MaybePromise, Modify } from "../types"

import { type ArkBaseQueryApiType, type ArkBaseQueryFn, arkRetry } from "./arkBaseQuery"

export type ArkFetchBaseQueryFn = ArkBaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  { timeout?: number },
  FetchBaseQueryMeta,
  BaseQueryApi
>

export type ArkFetchBaseQueryArgs<
  QueryApi extends ArkBaseQueryApiType<
    ThunkDispatch<any, any, any>,
    any,
    {
      authProvider: {
        getToken: (audience: string) => Promise<string | null>
        logout: () => Promise<void>
      }
    }
  > = ArkBaseQueryApiType<
    ThunkDispatch<any, any, any>,
    any,
    {
      authProvider: {
        getToken: (audience: string) => Promise<string | null>
        logout: () => Promise<void>
      }
    }
  >,
> = Modify<
  FetchBaseQueryArgs,
  {
    baseUrl?: string | (() => string)
    prepareHeaders?: (
      headers: Headers,
      api: Pick<QueryApi, "getState" | "extra" | "endpoint" | "type" | "forced"> & {
        arg: string | FetchArgs
        extraOptions: unknown
      },
    ) => MaybePromise<void | Headers>
    responseHandler?: FetchBaseQueryArgs["responseHandler"] | "blob"
  }
>

const defaultIsJsonContentType = (headers: Headers): boolean =>
  /application\/(.+\+)?json/.test(headers.get("Content-Type") ?? "")

export type AuthOptions = {
  audience?: string | (() => string)
}

export function handleExportsDownload(blob: Blob, fileName?: string, mimeType?: string) {
  const url = window.URL.createObjectURL(
    new Blob([blob], mimeType ? { type: mimeType } : undefined),
  )
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", (fileName ?? "download") || "download")
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

const betterContentTypeResponseHandler =
  (orig: ArkFetchBaseQueryArgs["responseHandler"]) => async (response: Response) => {
    // respect the configured 'typed' responseHandler for 'successful' requests while using 'best-guess' for failed requests
    // this is based on the assumption that Devs configure the 'expected' result in case of success not of failures
    if (response.status >= 200 && response.status < 300) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      if (orig === "json") return response.json()
      if (orig === "blob") return response.blob()
      if (orig === "text") return response.text()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      if (typeof orig === "function") return orig(response)
    }

    const disposition = response.headers.get("Content-Disposition")?.trim()
    const contentType = response.headers.get("Content-Type")?.trim()

    if (defaultIsJsonContentType(response.headers))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.json()

    if (disposition) {
      const parsed = parse(disposition)

      if (parsed.type !== "inline") {
        const fn = String(parsed.parameters.filename)
        handleExportsDownload(await response.blob(), fn, contentType)
        return undefined
      }
    }

    if (["application/octet-stream", "binary/octet-stream"].includes(contentType ?? ""))
      return response.blob()

    return response.text()
  }

export function arkFetchBaseQuery(
  fetchConfig?: ArkFetchBaseQueryArgs,
  arkFetchConfig?: {
    retryConfig?: RetryOptions
    authConfig?: AuthOptions
  },
) {
  fetchConfig ??= {}

  fetchConfig.isJsonContentType ??= defaultIsJsonContentType
  fetchConfig.timeout ??= 30 * 1000
  fetchConfig.responseHandler = betterContentTypeResponseHandler(fetchConfig.responseHandler)

  const prepareHeaders = fetchConfig.prepareHeaders
  fetchConfig.prepareHeaders = async (headers, api) => {
    const { arg } = api

    if (arg && typeof arg === "object" && "body" in arg && arg.body instanceof FormData) {
      // Remove Content-Type for FormData to let the browser set it
      headers.delete("Content-Type")
    } else {
      // Set Content-Type to application/json for all other requests
      headers.set("Content-Type", "application/json")
      headers.set("Accept", "application/json")
    }

    await prepareHeaders?.(headers, api)
  }

  const q: ArkFetchBaseQueryFn = async (args, api, extraOptions) => {
    let baseUrl = fetchConfig.baseUrl
    if (baseUrl && typeof baseUrl === "function") {
      baseUrl = baseUrl()
    }

    let prepareHeaders = fetchConfig.prepareHeaders

    if (arkFetchConfig?.authConfig?.audience) {
      let audience = arkFetchConfig.authConfig.audience
      if (audience && typeof audience === "function") {
        audience = audience()
      }

      if (audience) {
        prepareHeaders = async (headers, api) => {
          const token = await api.extra.authProvider.getToken(audience)

          if (token && token !== "") {
            headers.set("authorization", `Bearer ${token}`)
          } else {
            // if token is not available, logout the user as the audience is required for this request
            await api.extra.authProvider.logout()
          }

          await fetchConfig.prepareHeaders?.(headers, api)
        }
      }
    }

    const timeout = extraOptions?.timeout ?? fetchConfig.timeout ?? 60 * 1000

    const c = { ...fetchConfig, baseUrl, prepareHeaders, timeout } as FetchBaseQueryArgs

    if (typeof args === "object" && "responseHandler" in args)
      args.responseHandler = betterContentTypeResponseHandler(args.responseHandler)

    const baseQuery = fetchBaseQuery(c)

    const result = await baseQuery(args, api, extraOptions ?? {})

    // SKIP retry if the error doesn't look transient
    if (result.error) {
      if (
        typeof result.error.status === "number" &&
        result.error.status < 500 &&
        result.error.status !== 429
      ) {
        retry.fail(result.error, result.meta)
      }
      if (result.error.status === "PARSING_ERROR") retry.fail(result.error, result.meta)
    }

    return result
  }

  let retryConfig = arkFetchConfig?.retryConfig

  retryConfig ??= {
    maxRetries: 2, // RTKQ defaults to 5, too much
  }

  return arkRetry(q, retryConfig)
}

export type ArkFetchBaseQuery = typeof arkFetchBaseQuery
