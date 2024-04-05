import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { ArkReauthQuery } from "../../lib/authentication/arkBaseQuery";

const baseurl = "";

export const authPlaygroundApi = createApi({
  reducerPath: "authPlayground",
  baseQuery: ArkReauthQuery(baseurl),
  endpoints: (builder) => ({
    fetchSampleData: builder.query<any, null>({
      query: () => "",
    }),
  }),
});
export const { useFetchSampleDataQuery } = authPlaygroundApi;
