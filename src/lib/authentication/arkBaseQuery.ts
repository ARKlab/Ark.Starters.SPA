import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { authProvider } from "../../features/authentication/authenticationSlice";
import {
  tokenReceived,
  loggedOut,
} from "../../features/authentication/authenticationSlice";
import { RootState } from "../../app/configureStore";

function GetBaseQuery(baseUrl: string) {
  return fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.data?.token;

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });
}

export function GetArkReauthQuery(baseUrl: string) {
  const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    let baseQuery = GetBaseQuery(baseUrl);
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      // try to get a new token
      const refreshResult = await authProvider.getToken();
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
