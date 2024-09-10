import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { PostDataType } from "./jsonPlaceholderTypes";
export const jsonPlaceholderSlice = createApi({
  reducerPath: "jsonPlaceholder",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholdesr.typicode.com/",
  }),
  endpoints: builder => ({
    fetchPosts: builder.query<PostDataType[], null>({
      query: () => "posts",
    }),
    postPosts: builder.mutation({
      query: (body: PostDataType) => ({
        url: "posts",
        method: "POST",
        body,
      }),
    }),
  }),
});
export const { useFetchPostsQuery, usePostPostsMutation } = jsonPlaceholderSlice;
