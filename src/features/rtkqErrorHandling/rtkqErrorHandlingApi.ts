import { createApi } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

import { appFetchQuery } from "../../app/appFetchQuery";

export type ResultOption = "200" | "400" | "429" | "500" | "Error" | "200WithWrongSchema" | "Timeout";

export const rtkqErrorHandlingApi = createApi({
  reducerPath: "rtkqErrorHandlingApi",
  baseQuery: appFetchQuery({
    baseUrl: "https://rtkq.me",
  }),
  endpoints: builder => ({
    get: builder.query<{ status: string }, ResultOption>({
      query: (option: ResultOption) => `/${option}`,
      extraOptions: { dataSchema: z.object({ status: z.string() }) },
    }),
    post: builder.mutation<{ status: string }, ResultOption>({
      query: (option: ResultOption) => ({
        url: `/${option}`,
        method: "POST",
      }),
      extraOptions: { dataSchema: z.object({ status: z.string() }) },
    }),
  }),
});

export const { useGetQuery, usePostMutation } = rtkqErrorHandlingApi;
