import type { BaseQueryArg, QueryReturnValue } from "@reduxjs/toolkit/query";
import { z } from "zod";

import type {
  ArkBaseQueryError,
  ArkBaseQueryMeta,
  ArkBaseQueryResult,
  ArkBaseQueryFn,
  ArkBaseQueryExtraOptions,
  ArkBaseQueryApi,
} from "./arkBaseQuery";

export type ZodSchemaError = {
  status: "ZOD_SCHEMA_ERROR";
  payload?: unknown;
  error: string;
};

export type withZodResultValidationType = <BaseQuery extends ArkBaseQueryFn>(
  baseQuery: BaseQuery,
  config?: void,
) => ArkBaseQueryFn<
  BaseQueryArg<BaseQuery>,
  ArkBaseQueryResult<BaseQuery>,
  ArkBaseQueryError<BaseQuery> | ZodSchemaError,
  ArkBaseQueryExtraOptions<BaseQuery> & { dataSchema?: z.ZodType<ArkBaseQueryResult<BaseQuery>> },
  NonNullable<ArkBaseQueryMeta<BaseQuery>>,
  ArkBaseQueryApi<BaseQuery>
>;

/**
 * HOF that wraps a base query function with additional functionality for data validation using zod
 *
 * @param baseQuery The base query function to be wrapped.
 * @returns A modified version of the baseQuery with added data validation.
 */
export const withZodResultValidation: withZodResultValidationType =
  (baseQuery, _) => async (args, api, extraOptions) => {
    // Call the original baseQuery function with the provided arguments
    const returnValue = (await baseQuery(args, api, extraOptions)) as QueryReturnValue<
      ArkBaseQueryResult<typeof baseQuery>,
      ArkBaseQueryError<typeof baseQuery>,
      ArkBaseQueryMeta<typeof baseQuery>
    >;

    // Retrieve the data schema from the extraOptions object
    const zodSchema = extraOptions?.dataSchema;

    if (!zodSchema) return returnValue;
    if (returnValue.error) return returnValue;

    const { data } = returnValue;

    const res = zodSchema.safeParse(data);
    if (res.success) return returnValue;

    return {
      ...returnValue,
      error: {
        payload: data,
        error: z.prettifyError(res.error),
        status: "ZOD_SCHEMA_ERROR",
      },
    };
  };
