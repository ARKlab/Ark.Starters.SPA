/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import { fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import isNumber from "lodash-es/isNumber";
import type { z } from "zod";

import type { AppQueryApi } from "../../app/createAppApi";
import { ProblemDetailsSchema, type ProblemDetailsType } from "../errorHandler/problemDetails";

const mimeType =
  /(?<type>\w*)\/(?:(?<ext>[\w\.-]+)\+)?(?:(?<subtype>[\w\.-]*))?(?:;(?:(?<key>.+)=(?<value>.*);)*(?<key>.+)=(?<value>.*))?/;

export const isJsonContentType = (s: string) => {
  const r = mimeType.exec(s);
  if (!r?.groups) return false;
  return r.groups["subtype"] == "json";
};

export type ArkFetchQueryArgs = Parameters<typeof fetchBaseQuery>[0];

export type QueryReturnValue<T = unknown, E = unknown, M = unknown> =
  | {
      error: E;
      data?: undefined;
      meta?: M;
    }
  | {
      error?: undefined;
      data: T;
      meta?: M;
    };

export type ArkQueryFn<
  Args = any,
  Result = unknown,
  Error = unknown,
  DefinitionExtraOptions = {},
  Meta = {},
  Api extends BaseQueryApi = BaseQueryApi,
> = (args: Args, api: Api, extraOptions: DefinitionExtraOptions) => MaybePromise<QueryReturnValue<Result, Error, Meta>>;

export type AppQueryFn<
  Args = any,
  Result = unknown,
  Error = unknown,
  DefinitionExtraOptions = {},
  Meta = {},
> = ArkQueryFn<Args, Result, Error, DefinitionExtraOptions, Meta, AppQueryApi>;

export type ArkFetchQueryError =
  | FetchBaseQueryError
  | {
      status: "PROBLEM_DETAILS";
      originalStatus: number;
      data: ProblemDetailsType;
      error: string;
    }
  | {
      status: "ZOD_ERROR";
      data: unknown;
      error: string;
      zodError: z.ZodError;
    };

export type ArkExtraOptions = {
  schema?: z.ZodTypeAny;
};

export type ArkQueryArg<T extends (arg: any, ...args: any[]) => any> = T extends (arg: infer A, ...args: any[]) => any
  ? A
  : any;
export type ArkQueryResult<BaseQuery extends ArkQueryFn> =
  UnwrapPromise<ReturnType<BaseQuery>> extends infer Unwrapped
    ? Unwrapped extends {
        data: any;
      }
      ? Unwrapped["data"]
      : never
    : never;

export type ArkQueryError<BaseQuery extends ArkQueryFn> = Exclude<
  UnwrapPromise<ReturnType<BaseQuery>>,
  {
    error?: undefined;
  }
>["error"];
export type ArkQueryMeta<BaseQuery extends ArkQueryFn> = UnwrapPromise<ReturnType<BaseQuery>>["meta"];

export type ArkQueryExtraOptions<BaseQuery extends ArkQueryFn> = Parameters<BaseQuery>[2];
export type ArkQueryApi<BaseQuery extends ArkQueryFn> = Parameters<BaseQuery>[1];

export type ArkQueryEnhancer<
  BaseQuery extends ArkQueryFn,
  AdditionalArgs = unknown,
  AdditionalDefinitionExtraOptions = unknown,
  Config = void,
> = (
  baseQuery: BaseQuery,
  config: Config,
) => ArkQueryFn<
  ArkQueryArg<BaseQuery> & AdditionalArgs,
  ArkQueryResult<BaseQuery>,
  ArkQueryError<BaseQuery>,
  ArkQueryExtraOptions<BaseQuery> & AdditionalDefinitionExtraOptions,
  NonNullable<ArkQueryMeta<BaseQuery>>,
  ArkQueryApi<BaseQuery>
>;

export type FetchQueryFn<Api extends BaseQueryApi = BaseQueryApi> = ArkQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta,
  Api
>;

export type RetryConditionFunction<BaseQuery extends ArkQueryFn> = (
  error: ArkQueryError<BaseQuery>,
  args: ArkQueryArg<BaseQuery>,
  extraArgs: {
    attempt: number;
    baseQueryApi: ArkQueryApi<BaseQuery>;
    extraOptions: ArkQueryExtraOptions<BaseQuery> & ArkRetryOptions<BaseQuery>;
  },
) => boolean;

export type ArkRetryOptions<BaseQuery extends ArkQueryFn> = {
  /**
   * Function used to determine delay between retries
   */
  backoff?: (attempt: number, maxRetries: number) => Promise<void>;
} & (
  | {
      /**
       * How many times the query will be retried (default: 5)
       */
      maxRetries?: number;
      retryCondition?: undefined;
    }
  | {
      /**
       * Callback to determine if a retry should be attempted.
       * Return `true` for another retry and `false` to quit trying prematurely.
       */
      retryCondition?: RetryConditionFunction<BaseQuery>;
      maxRetries?: undefined;
    }
);

export function detaultRetryCondition<BaseQuery extends FetchQueryFn>(
  e: Parameters<RetryConditionFunction<BaseQuery>>[0],
  _: Parameters<RetryConditionFunction<BaseQuery>>[1],
  { attempt }: Parameters<RetryConditionFunction<BaseQuery>>[2],
): boolean {
  if (attempt >= 3) return false;

  /*
   * if result is error:
   * - retry if status >= 500 (don't retry 4xx)
   * - retry if timeout
   */
  if (isNumber(e.status) && e.status >= 500) {
    return true;
  } else if (e.status === "PARSING_ERROR" && e.originalStatus >= 500) {
    return true;
  } else if (e.status === "TIMEOUT_ERROR") {
    return true;
  }

  return false;
}

export const arkFetchQuery = (args: ArkFetchQueryArgs) => {
  const q = fetchBaseQuery({
    ...args,
    isJsonContentType: h => {
      if (args?.isJsonContentType && args.isJsonContentType(h)) return true;
      return isJsonContentType(h.get("content-type") ?? "");
    },
  });

  const qq = async(args);

  return retry(q);
};

/*

      if (result.meta?.response?.headers.get("content-type")?.includes("application/problem+json")) {
        const r = ProblemDetailsSchema.safeParse(result.error.data);
        if (r.success) {
          result.error = {
            status: "PROBLEM_DETAILS",
            originalStatus: result.error.status,
            data: r.data,
            error: r.data.title + " - " + r.data.detail,
          };
          if (result.error.originalStatus >= 500) {
            return result;
          }
        }
      }

      if (extraOptions.schema) {
        const r = extraOptions.schema.safeParse(result.data);
        if (r.success) {
          result.data = r.data;
        } else {
          return {
            error: {
              status: "ZOD_ERROR",
              zodError: r.error,
              error: String(r.error),
              data: result.data,
            },
            meta: result.meta,
          };
        }
      }

      return result;
      
*/
