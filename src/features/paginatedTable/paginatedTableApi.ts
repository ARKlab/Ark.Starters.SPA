import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import * as R from "ramda";
import { ArkQueryParameters, ListResponse } from "../../lib/apiTypes";
import { delay } from "../../lib/helper";
import moviesData, { Movie } from "./fakeMoviesData";
import { orderBy, every, filter } from "lodash";

export const moviesApiSlice = createApi({
  reducerPath: "moviesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://bestMoviesApi.com/",
  }),
  tagTypes: ["Movies", "Page"],
  endpoints: (builder) => ({
    getMovies: builder.query<ListResponse<Movie>, ArkQueryParameters>({
      queryFn: async (params: ArkQueryParameters) => {
        await delay(500);
        const { pageIndex: page = 1, pageSize = 10 } = params;
        let retData = simulatedArkQueryWithParams(params);
        return {
          data: {
            data: retData.data,
            count: retData.count,
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

export const simulatedArkQueryWithParams = (params: ArkQueryParameters) => {
  const { pageIndex: page = 1, pageSize = 10, filters, sorting } = params;
  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  let filteredMovies = moviesData;

  if (filters && filters.length > 0) {
    filteredMovies = filter(filteredMovies, (movie) => {
      return every(filters, (columnFilter) => {
        let movieValue = movie[columnFilter.id as keyof Movie];
        if (
          columnFilter.id === "releaseDate" &&
          Array.isArray(columnFilter.value)
        ) {
          const releaseDate = new Date(movieValue as string);
          const filterStartDate = columnFilter.value[0]
            ? new Date(columnFilter.value[0]).toISOString()
            : null;
          const filterEndDate = columnFilter.value[1]
            ? new Date(columnFilter.value[1]).toISOString()
            : null;

          if (filterStartDate && filterEndDate) {
            // Se entrambe le date del filtro sono specificate, controlla se la data di rilascio è compresa tra di esse
            return (
              releaseDate.toISOString() >= filterStartDate &&
              releaseDate.toISOString() <= filterEndDate
            );
          } else if (filterStartDate) {
            // Se solo la data di inizio del filtro è specificata, controlla se la data di rilascio è successiva o uguale a essa
            return releaseDate.toISOString() >= filterStartDate;
          } else if (filterEndDate) {
            // Se solo la data di fine del filtro è specificata, controlla se la data di rilascio è precedente o uguale a essa
            return releaseDate.toISOString() <= filterEndDate;
          } else return true;
        } else if (
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
  let count = filteredMovies.length;
  let data = filteredMovies.slice(skip, skip + limit);
  data = data.map((movie) => ({
    ...movie,
    releaseDate: movie.releaseDate,
  }));

  return { data, count };
};
