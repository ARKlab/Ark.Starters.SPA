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
} from "./authenticationSlice";
import { RootState } from "../..";
import { AuthProvider } from "./providers/authProviderInterface";
import { baseUrlSelector } from "./envSlice";

export function ArkBaseQuery(
  args: string | FetchArgs,
  api: BaseQueryApi,
  extra: ExtraType
) {
  const authProviderInstance = (extra as ExtraType).authProvider;

  return ArkReauthQuery(authProviderInstance)(args, api, extra);
}

function BaseQuery(api: BaseQueryApi) {
  const baseUrl = baseUrlSelector(api.getState() as RootState);
  return fetchBaseQuery({
    baseUrl,
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

export function ArkReauthQuery(authProvider: AuthProvider) {
  const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const baseQuery = BaseQuery(api);
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      // try to get a new token
      const baseUrl = baseUrlSelector(api.getState() as RootState);
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
