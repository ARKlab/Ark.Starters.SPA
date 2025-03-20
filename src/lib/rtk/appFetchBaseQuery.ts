/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ThunkDispatch } from "@reduxjs/toolkit";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { fetchBaseQuery, retry } from "@reduxjs/toolkit/query";
import type {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  RetryOptions,
} from "@reduxjs/toolkit/query";

import type { MaybePromise, Modify } from "../types";

import { type ArkBaseQueryApiType, type ArkBaseQueryFn, arkRetry } from "./arkBaseQuery";

export type ArkFetchBaseQueryFn = ArkBaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  { timeout?: number },
  FetchBaseQueryMeta,
  BaseQueryApi
>;

export type ArkFetchBaseQueryArgs<
  QueryApi extends ArkBaseQueryApiType<
    ThunkDispatch<any, any, any>,
    any,
    { authProvider: { getToken: (audience: string) => Promise<string | null>; logout: () => Promise<void> } }
  > = ArkBaseQueryApiType<
    ThunkDispatch<any, any, any>,
    any,
    { authProvider: { getToken: (audience: string) => Promise<string | null>; logout: () => Promise<void> } }
  >,
> = Modify<
  FetchBaseQueryArgs,
  {
    baseUrl?: string | (() => string);
    prepareHeaders?: (
      headers: Headers,
      api: Pick<QueryApi, "getState" | "extra" | "endpoint" | "type" | "forced"> & {
        arg: string | FetchArgs;
        extraOptions: unknown;
      },
    ) => MaybePromise<void | Headers>;
  }
>;

const defaultIsJsonContentType = (headers: Headers): boolean =>
  /application\/(.+\+)?json/.test(headers.get("Content-Type") ?? "");

export type AuthOptions = {
  audience?: string | (() => string);
};

export function arkFetchBaseQuery(
  fetchConfig?: ArkFetchBaseQueryArgs,
  arkFetchConfig?: {
    retryConfig?: RetryOptions;
    authConfig?: AuthOptions;
  },
) {
  if (!fetchConfig) fetchConfig = {};

  const prepareHeaders = fetchConfig.prepareHeaders;

  fetchConfig.isJsonContentType ??= defaultIsJsonContentType;
  fetchConfig.timeout ??= 30 * 1000;
  fetchConfig.prepareHeaders = async (headers, api) => {
    const { arg } = api;

    if (arg && typeof arg === "object" && "body" in arg && arg.body instanceof FormData) {
      // Remove Content-Type for FormData to let the browser set it
      headers.delete("Content-Type");
    } else {
      // Set Content-Type to application/json for all other requests
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
    }

    await prepareHeaders?.(headers, api);
  };

  const q: ArkFetchBaseQueryFn = async (args, api, extraOptions) => {
    let baseUrl = fetchConfig.baseUrl;
    if (baseUrl && typeof baseUrl === "function") {
      baseUrl = baseUrl();
    }

    let prepareHeaders = fetchConfig.prepareHeaders;

    if (arkFetchConfig?.authConfig?.audience) {
      let audience = arkFetchConfig.authConfig.audience;
      if (audience && typeof audience === "function") {
        audience = audience();
      }

      if (audience) {
        prepareHeaders = async (headers, api) => {
          const token = await api.extra.authProvider.getToken(audience);

          if (token && token !== "") {
            headers.set("authorization", `Bearer ${token}`);
          } else {
            // if token is not available, logout the user as the audience is required for this request
            await api.extra.authProvider.logout();
          }

          await fetchConfig.prepareHeaders?.(headers, api);
        };
      }
    }

    const timeout = extraOptions?.timeout ?? fetchConfig.timeout ?? 60 * 1000;

    const c = { ...fetchConfig, baseUrl, prepareHeaders, timeout } as FetchBaseQueryArgs;

    const baseQuery = fetchBaseQuery(c);

    const result = await baseQuery(args, api, extraOptions ?? {});

    // SKIP retry if the error doesn't look transient
    if (result.error) {
      if (typeof result.error.status === "number" && result.error.status < 500 && result.error.status !== 429) {
        retry.fail(result.error, result.meta);
      }
      if (result.error.status === "PARSING_ERROR") retry.fail(result.error, result.meta);
    }

    return result;
  };

  let retryConfig = arkFetchConfig?.retryConfig;

  retryConfig ??= {
    maxRetries: 2, // RTKQ defaults to 5, too much
  };

  return arkRetry(q, retryConfig);
}

export type ArkFetchBaseQuery = typeof arkFetchBaseQuery;
