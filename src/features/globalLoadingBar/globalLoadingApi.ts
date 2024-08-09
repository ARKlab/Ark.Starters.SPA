import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { createAppApi } from "../../app/createAppApi";
import { delay } from "../../lib/helper";

export const globalLoadingSlice = createAppApi({
  reducerPath: "globalLoadingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://sample.com/",
  }),
  endpoints: builder => ({
    fastGet: builder.query<string, void>({
      queryFn: async () => {
        await delay(100);
        return {
          data: "fast",
        };
      },
    }),
    slowGet: builder.query<string, void>({
      queryFn: async () => {
        await delay(5000);
        return {
          data: "slow",
        };
      },
    }),
    fastMutation: builder.mutation<string, void>({
      queryFn: async () => {
        await delay(100);
        return {
          data: "fast",
        };
      },
    }),
    slowMutation: builder.mutation<string, void>({
      queryFn: async () => {
        await delay(5000);
        return {
          data: "slow",
        };
      },
    }),
  }),
});

export const { useFastGetQuery, useFastMutationMutation, useSlowGetQuery, useSlowMutationMutation } =
  globalLoadingSlice;
