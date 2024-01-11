import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import * as R from "ramda";
import { ListResponse } from "../../lib/apiTypes";
import { delay } from "../../lib/helper";
import moviesData, { Movie } from "./fakeMoviesData";
import { orderBy, every, filter } from "lodash";

type MovieQueryParams = {
  filters?: ColumnFiltersState;
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
  const { pageIndex: page = 1, pageSize = 10, filters, sorting } = params;
  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  let filteredMovies = moviesData;

  if (filters && filters.length > 0) {
    filteredMovies = filter(filteredMovies, (movie) => {
      return every(filters, (columnFilter) => {
        const movieValue = movie[columnFilter.id as keyof Movie];
        if (
          typeof movieValue === "string" &&
          typeof columnFilter.value === "string"
        ) {
          return movieValue.includes(columnFilter.value);
        }
        return movieValue === columnFilter.value;
      });
    });
  }

  if (sorting && sorting.length > 0) {
    const sortFields = sorting.map((sort) => sort.id);
    const sortOrders = sorting.map((sort) => (sort.desc ? "desc" : "asc"));
    filteredMovies = orderBy(filteredMovies, sortFields, sortOrders);
  }
  return filteredMovies.slice(skip, skip + limit);
};
