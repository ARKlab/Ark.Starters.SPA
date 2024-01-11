import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { SortingState } from "@tanstack/react-table";
import * as R from "ramda";
import { ListResponse } from "../../lib/apiTypes";
import { delay } from "../../lib/helper";
import moviesData, { Movie } from "./fakeMoviesData";
import { orderBy } from "lodash";

type MovieQueryParams = {
  genre?: string;
  director?: string;
  actors?: string;
  plot?: string;
  pageIndex?: number;
  pageSize?: number;
  sorting?: SortingState;
};
export const moviesApiSlice = createApi({
  reducerPath: "moviesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://bestMoviesApi.com/",
  }),
  tagTypes: ["Movies", "Page"],
  endpoints: (builder) => ({
    getMovies: builder.query<ListResponse<Movie>, MovieQueryParams>({
      queryFn: async (params: MovieQueryParams) => {
        await delay(2000);
        const { pageIndex: page = 1, pageSize = 10 } = params;
        return {
          data: {
            data: simulatedArkQueryWithParams(params),
            count: moviesData.length,
            page: page,
            limit: pageSize,
          },
        };
      },
      providesTags: ["Movies", "Page"],
    }),
  }),
});

export const { useGetMoviesQuery } = moviesApiSlice;

export const simulatedArkQueryWithParams = (params: MovieQueryParams) => {
  const {
    pageIndex: page = 1,
    pageSize = 10,
    genre,
    director,
    actors,
    plot,
    sorting,
  } = params;
  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  let filteredMovies = moviesData;

  if (genre) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.genre.includes(genre)
    );
  }

  if (director) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.director.includes(director)
    );
  }

  if (actors) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.actors.includes(actors)
    );
  }

  if (plot) {
    filteredMovies = filteredMovies.filter((movie) =>
      movie.plot.includes(plot)
    );
  }

  if (sorting && sorting.length > 0) {
    const sortFields = sorting.map((sort) => sort.id);
    const sortOrders = sorting.map((sort) => (sort.desc ? "desc" : "asc"));
    filteredMovies = orderBy(filteredMovies, sortFields, sortOrders);
  }
  return filteredMovies.slice(skip, skip + limit);
};
