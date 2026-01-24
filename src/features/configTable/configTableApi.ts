import { createApi } from "@reduxjs/toolkit/query/react";

import { appFetchQuery } from "../../app/appFetchQuery";

import type { Employee } from "./employee";

export const configTableApiSlice = createApi({
  reducerPath: "configTableApi",
  baseQuery: appFetchQuery({
    baseUrl: "https://config.api/",
  }),
  tagTypes: ["Employee/list"],
  endpoints: builder => ({
    getConfig: builder.query<Employee[], null>({
      query: () => "/",
      providesTags: ["Employee/list"],
    }),
    postConfig: builder.mutation<void, { employees: Employee[]; throwError: boolean }>({
      query: body => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employee/list"], //each time a post is done the cache is invalidated and the data is fetched again
    }),
  }),
});

export const { useGetConfigQuery, usePostConfigMutation } = configTableApiSlice;
