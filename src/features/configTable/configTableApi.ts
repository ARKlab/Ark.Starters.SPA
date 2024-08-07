import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { delay } from "../../lib/helper";

import type { Employee } from "./configTable";

const data = [
  { name: "Mario", surName: "Rossi", employed: true },
  { name: "Luigi", surName: "Bianchi", employed: false },
  { name: "Giuseppe", surName: "Verdi", employed: true },
  { name: "Francesco", surName: "Neri", employed: false },
  { name: "Antonio", surName: "Bruno", employed: true },
  { name: "Giovanni", surName: "Russo", employed: false },
  { name: "Andrea", surName: "Romano", employed: true },
  { name: "Michele", surName: "Ricci", employed: false },
  { name: "Alessandro", surName: "Marino", employed: true },
  { name: "Roberto", surName: "Greco", employed: false },
  { name: "Riccardo", surName: "Gallo", employed: true },
  { name: "Marco", surName: "Costa", employed: false },
  { name: "Nicola", surName: "Giordano", employed: true },
  { name: "Davide", surName: "Mancini", employed: false },
  { name: "Alberto", surName: "Rizzo", employed: true },
  { name: "Daniele", surName: "Lombardi", employed: false },
  { name: "Salvatore", surName: "Moretti", employed: true },
  { name: "Vincenzo", surName: "Fontana", employed: false },
  { name: "Federico", surName: "Russo", employed: true },
  { name: "Gianluca", surName: "Ferrari", employed: false },
] as Employee[];

export const configTableApiSlice = createApi({
  reducerPath: "configTableApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://myconfigUrlApi.com/",
  }),
  tagTypes: ["Employee"],
  endpoints: builder => ({
    getConfig: builder.query<Employee[], null>({
      queryFn: async () => {
        await delay(2000);
        return { data };
      },
      providesTags: ["Employee"],
    }),
    postConfig: builder.mutation<void, { employees: Employee[]; throwError: boolean }>({
      queryFn: async ({ throwError }) => {
        await delay(2000);
        if (throwError) {
          return {
            error: { status: 400, data: { message: "Bad Request" } },
          };
        }
        return { data: undefined };
      },
      invalidatesTags: ["Employee"], //each time a post is done the cache is invalidated and the data is fetched again
    }),
  }),
});

export const { useGetConfigQuery, usePostConfigMutation } = configTableApiSlice;
