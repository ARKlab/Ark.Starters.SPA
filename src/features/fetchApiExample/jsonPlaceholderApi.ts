import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { PostDataType } from "./jsonPlaceholderTypes";
export const jsonPlaceholderApi = createApi({
  reducerPath: "jsonPlaceholder",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
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
export const { useFetchPostsQuery, usePostPostsMutation } = jsonPlaceholderApi;
