import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { createAppApi } from "../../app/createAppApi";

import type { PostDataType } from "./jsonPlaceholderTypes";
export const jsonPlaceholderSlice = createAppApi({
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
export const { useFetchPostsQuery, usePostPostsMutation } = jsonPlaceholderSlice;
