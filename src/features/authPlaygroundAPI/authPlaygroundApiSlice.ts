import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ArkReauthQuery } from "../../lib/authentication/arkBaseQuery";
import { ExtraType } from "../authentication/authenticationSlice";

const baseurl = "";

export const authPlaygroundApi = createApi({
  reducerPath: "authPlayground",
  baseQuery: (args, api, extra) => {
    // Now you can use extraArgument
    const authProviderInstance = (extra as ExtraType).authProvider;

    return ArkReauthQuery(baseurl, authProviderInstance)(args, api, extra);
  },
  endpoints: (builder) => ({
    fetchSampleData: builder.query<any, null>({
      query: () => "",
    }),
  }),
});

export const { useFetchSampleDataQuery } = authPlaygroundApi;
