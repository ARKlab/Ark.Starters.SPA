import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { GetArkReauthQuery } from "../../lib/authentication/arkBaseQuery";

const baseurl = "";

export const authPlaygroundApi = createApi({
  reducerPath: "authPlayground",
  baseQuery: GetArkReauthQuery(baseurl),
  endpoints: (builder) => ({
    fetchSampleData: builder.query<any, null>({
      query: () => "",
    }),
  }),
});
export const { useFetchSampleDataQuery } = authPlaygroundApi;
