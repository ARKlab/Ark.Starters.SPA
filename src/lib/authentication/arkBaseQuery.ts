import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import {
  tokenSelector,
  loggedOut,
  tokenReceived,
  ExtraType,
} from "../../features/authentication/authenticationSlice";
import { RootState } from "../..";
import { AuthProvider } from "./authProviderInterface";

const baseurl = "";
export function ArkBaseQuery(args: any, api: BaseQueryApi, extra: {}) {
  // Now you can use extraArgument
  const authProviderInstance = (extra as ExtraType).authProvider;

  return ArkReauthQuery(baseurl, authProviderInstance)(args, api, extra);
}

function BaseQuery(baseUrl: string) {
  return fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = tokenSelector(getState() as RootState);
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });
}

export function ArkReauthQuery(baseUrl: string, authProvider: AuthProvider) {
  const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    let baseQuery = BaseQuery(baseUrl);
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      // try to get a new token
      const refreshResult = await authProvider.getToken(baseUrl);
      if (refreshResult) {
        // store the new token
        api.dispatch(tokenReceived(refreshResult));
        // retry the initial query
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(loggedOut());
      }
    }
    return result;
  };
  return baseQueryWithReauth;
}
