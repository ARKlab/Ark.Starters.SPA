import type { BaseQueryApi, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import type { RootState, ExtraType } from "../../app/configureStore";

import { tokenSelector, loggedOut, tokenReceived } from "./authenticationSlice";
import { baseUrlSelector } from "./envSlice";

export function ArkBaseQuery(args: string | FetchArgs, api: BaseQueryApi, extraOptions: ExtraType) {
  return ArkQuery()(args, api, extraOptions);
}

function createBaseQuery(api: BaseQueryApi) {
  const baseUrl = baseUrlSelector(api.getState() as RootState);
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: async (headers, { extra, getState }) => {
      let token = tokenSelector(getState() as RootState);

      if (!token || token === "") {
        token = await (extra as ExtraType).authProvider.getToken(baseUrl);
        if (token) api.dispatch(tokenReceived(token));
        else api.dispatch(loggedOut());
      }

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  });
}

export function ArkQuery() {
  const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, ExtraType> = async (
    args,
    api,
    extraOptions,
  ) => {
    const baseQuery = createBaseQuery(api);
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      result = await baseQuery(args, api, extraOptions);
    }
    return result;
  };
  return baseQuery;
}
