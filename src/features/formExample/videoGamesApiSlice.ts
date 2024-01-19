import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import * as R from "ramda";
import { ArkQueryParameters, ListResponse } from "../../lib/apiTypes";
import { delay } from "../../lib/helper";
import {
  VideoGameGenre,
  VideoGame,
  videoGamesSampleData,
  gameGenres,
} from "./videoGamesSampleDataAndTypes";

export const videoGameApiSlice = createApi({
  reducerPath: "videoGameApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://bestVg.com/",
  }),
  tagTypes: ["VideoGames", "Page", "Genres"],
  endpoints: (builder) => ({
    getVideoGames: builder.query<ListResponse<VideoGame>, ArkQueryParameters>({
      queryFn: async (params: ArkQueryParameters) => {
        await delay(500);
        const { pageIndex: page = 1, pageSize = 10 } = params;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let retData = {
          data: videoGamesSampleData.slice(skip, skip + limit),
          count: videoGamesSampleData.length,
        };
        return {
          data: {
            data: retData.data,
            count: retData.count,
            page: page,
            limit: pageSize,
          },
        };
      },
      providesTags: ["VideoGames", "Page"],
    }),
    getVideoGamesGenres: builder.query<VideoGameGenre[], void>({
      queryFn: async () => {
        await delay(300);
        return { data: gameGenres };
      },
      providesTags: ["Genres"],
    }),
    insertNewVideoGame: builder.mutation<VideoGame, VideoGame>({
      queryFn: async (newVideoGame) => {
        await delay(300);
        videoGamesSampleData.push(newVideoGame);
        return { data: newVideoGame };
      },
      invalidatesTags: ["VideoGames"],
    }),
  }),
});

export const {
  useGetVideoGamesQuery,
  useInsertNewVideoGameMutation,
  useGetVideoGamesGenresQuery,
} = videoGameApiSlice;
