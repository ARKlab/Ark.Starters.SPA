import { createApi } from "@reduxjs/toolkit/query/react"

import { appFetchQuery } from "../../app/appFetchQuery"

import type { PostDataType } from "./postsTypes"
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: appFetchQuery({
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
})
export const { useFetchPostsQuery, usePostPostsMutation } = postsApi
