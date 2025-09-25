import type { QueryReturnValue } from "@reduxjs/toolkit/query";
import { z } from "zod";

import type { ArkFetchBaseQueryFn } from "./appFetchBaseQuery";
import type { ArkBaseQueryEnhancer, ArkBaseQueryError, ArkBaseQueryMeta, ArkBaseQueryResult } from "./arkBaseQuery";

export const ProblemDetailsSchema = z
  .object({
    status: z.number().nullish(),
    title: z.string(),
    detail: z.string().nullish(),
    type: z.string(), // zod url() validates absolute urls only while RFC states type and instance can be relative uri
    instance: z.string().nullish(),
  })
  .passthrough();

export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>;

export type ProblemDetailsError = {
  status: "PROBLEM_DETAILS_ERROR";
  problemDetails: ProblemDetails;
};

export function isProblemDetailsError(error: unknown): error is ProblemDetailsError {
  return (
    typeof error === "object" &&
    error != null &&
    "status" in error &&
    error.status === "PROBLEM_DETAILS_ERROR" &&
    "error" in error
  );
}

export const withProblemDetails: ArkBaseQueryEnhancer<
  unknown,
  unknown,
  void,
  ProblemDetailsError,
  ArkFetchBaseQueryFn
> = (baseQuery, _) => async (args, api, extraOptions) => {
  // Call the original baseQuery function with the provided arguments
  const returnValue = (await baseQuery(args, api, extraOptions)) as QueryReturnValue<
    ArkBaseQueryResult<typeof baseQuery>,
    ArkBaseQueryError<typeof baseQuery>,
    ArkBaseQueryMeta<typeof baseQuery>
  >;

  if (returnValue.error) {
    const { error } = returnValue;
    if (
      typeof error.status === "number" &&
      returnValue.meta?.response?.headers.get("content-type")?.includes("application/problem+json")
    ) {
      const res = ProblemDetailsSchema.safeParse(error.data);
      if (res.success) {
        return {
          ...returnValue,
          error: {
            problemDetails: res.data,
            status: "PROBLEM_DETAILS_ERROR",
          },
        };
      } // else ignore the fact that the response is not a problem details even if the content-type is application/problem+json and return the original error
    }
  }
  return returnValue;
};
