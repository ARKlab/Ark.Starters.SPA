import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PostDataType } from "./jsonPlaceholderTypes";
export const jsonPlaceholderSlice = createApi({
  reducerPath: "jsonPlaceholder",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  endpoints: (builder) => ({
    fetchPosts: builder.query<PostDataType[], null>({
      query: () => "posts",
    }),
    postPosts: builder.mutation({
      query: (body) => ({
        url: "posts",
        method: "POST",
        body,
      }),
    }),
  }),
});
export const { useFetchPostsQuery, usePostPostsMutation } =
  jsonPlaceholderSlice;
