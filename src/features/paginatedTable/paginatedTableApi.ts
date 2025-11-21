import { createApi } from "@reduxjs/toolkit/query/react";
import { every, orderBy, filter } from "lodash-es";

import { appFetchQuery } from "../../app/appFetchQuery";
import type { ArkPagedQueryParameters, ListResponse } from "../../lib/apiTypes";
import { delay } from "../../lib/helper";

import type { Movie } from "./fakeMoviesData";
import moviesData from "./fakeMoviesData";

export const moviesApiSlice = createApi({
  reducerPath: "moviesApi",
  baseQuery: appFetchQuery({
    baseUrl: "https://bestMoviesApi.com/",
  }),
  tagTypes: ["Movies", "Page"],
  endpoints: builder => ({
    getMovies: builder.query<ListResponse<Movie>, ArkPagedQueryParameters>({
      queryFn: async (params: ArkPagedQueryParameters) => {
        await delay(500);
        const { pageIndex: page = 1, pageSize = 10 } = params;
        const retData = simulatedArkQueryWithParams(params);
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

export const simulatedArkQueryWithParams = (params: ArkPagedQueryParameters) => {
  const { pageIndex: page = 1, pageSize = 10, filters, sorting } = params;
  const skip = (page - 1) * pageSize;
  const limit = pageSize;

  let filteredMovies = moviesData;

  if (filters && filters.length > 0) {
    filteredMovies = filter(filteredMovies, movie => {
      return every(filters, columnFilter => {
        const movieValue = movie[columnFilter.id as keyof Movie];
        if (columnFilter.id === "releaseDate" && Array.isArray(columnFilter.value)) {
          const releaseDate = new Date(movieValue as string);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const filterStartDate = columnFilter.value[0] ? new Date(columnFilter.value[0]).toISOString() : null;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const filterEndDate = columnFilter.value[1] ? new Date(columnFilter.value[1]).toISOString() : null;

          if (filterStartDate && filterEndDate) {
            // Both dates are specified, check if release date is within the range
            return releaseDate.toISOString() >= filterStartDate && releaseDate.toISOString() <= filterEndDate;
          } else if (filterStartDate) {
            // If only the filter start date is specified, check if the release date is greater than or equal to it
            return releaseDate.toISOString() >= filterStartDate;
          } else if (filterEndDate) {
            // If only the filter end date is specified, check if the release date is less than or equal to it
            return releaseDate.toISOString() <= filterEndDate;
          } else return true;
        } else if (typeof movieValue === "string" && typeof columnFilter.value === "string") {
          return movieValue.includes(columnFilter.value);
        }
        return movieValue === columnFilter.value;
      });
    });
  }

  if (sorting && sorting.length > 0) {
    const sortFields = sorting.map(sort => sort.id);
    const sortOrders = sorting.map(sort => (sort.desc ? "desc" : "asc"));
    filteredMovies = orderBy(filteredMovies, sortFields, sortOrders);
  }
  const count = filteredMovies.length;
  let data = filteredMovies.slice(skip, skip + limit);
  data = data.map(movie => ({
    ...movie,
    releaseDate: movie.releaseDate,
  }));

  return { data, count };
};
