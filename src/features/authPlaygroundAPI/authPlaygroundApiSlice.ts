import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ArkBaseQuery,
  ArkReauthQuery,
} from "../../lib/authentication/arkBaseQuery";
import { ExtraType } from "../authentication/authenticationSlice";

const baseurl = "";

export const authPlaygroundApi = createApi({
  reducerPath: "authPlayground",
  baseQuery: ArkBaseQuery,
  endpoints: (builder) => ({
    fetchSampleData: builder.query<any, null>({
      query: () => "",
    }),
  }),
});

export const { useFetchSampleDataQuery } = authPlaygroundApi;
