/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ThunkDispatch } from "@reduxjs/toolkit"
import {
  retry,
  type BaseQueryApi,
  type BaseQueryArg,
  type QueryReturnValue,
  type RetryOptions,
} from "@reduxjs/toolkit/query"

import type { MaybePromise, Modify, UnwrapPromise } from "../types"

export interface ArkBaseQueryApiType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  D extends ThunkDispatch<any, any, any> = ThunkDispatch<any, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  E = any,
> extends Modify<
  BaseQueryApi,
  {
    dispatch: D
    getState: () => S
    extra: E
  }
> {}

export type ArkBaseQueryFn<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Args = any,
  Result = unknown,
  Error = unknown,
  DefinitionExtraOptions = {},
  Meta = {},
  Api extends ArkBaseQueryApiType = ArkBaseQueryApiType,
> = (args: Args, api: Api, extraOptions?: DefinitionExtraOptions) => MaybePromise<QueryReturnValue<Result, Error, Meta>>

export type ArkBaseQueryResult<BaseQuery extends ArkBaseQueryFn> =
  UnwrapPromise<ReturnType<BaseQuery>> extends infer Unwrapped
    ? Unwrapped extends {
        data: unknown
      }
      ? Unwrapped["data"]
      : never
    : never

export type ArkBaseQueryError<BaseQuery extends ArkBaseQueryFn> = Exclude<
  UnwrapPromise<ReturnType<BaseQuery>>,
  {
    error?: undefined
  }
>["error"]

export type ArkBaseQueryMeta<BaseQuery extends ArkBaseQueryFn> = UnwrapPromise<ReturnType<BaseQuery>>["meta"]

export type ArkBaseQueryExtraOptions<BaseQuery extends ArkBaseQueryFn> = NonNullable<Parameters<BaseQuery>[2]>

export type ArkBaseQueryApi<BaseQuery extends ArkBaseQueryFn> = Parameters<BaseQuery>[1]

// Helper types to avoid redundant type constituents
type IntersectIfNotUnknown<Base, Additional> = [Additional] extends [unknown] ? Base : Base & Additional
type UnionIfObject<Base, Additional> = [Additional] extends [object] ? Base | Additional : Base

export type ArkBaseQueryEnhancer<
  AdditionalArgs = unknown,
  AdditionalDefinitionExtraOptions = unknown,
  Config = void,
  AdditionalError = void,
  BaseQueryBase extends ArkBaseQueryFn = ArkBaseQueryFn,
> = <BaseQuery extends BaseQueryBase>(
  baseQuery: BaseQuery,
  config?: Config,
) => ArkBaseQueryFn<
  IntersectIfNotUnknown<BaseQueryArg<BaseQuery>, AdditionalArgs>,
  ArkBaseQueryResult<BaseQuery>,
  UnionIfObject<ArkBaseQueryError<BaseQuery>, AdditionalError>,
  ArkBaseQueryExtraOptions<BaseQuery> & AdditionalDefinitionExtraOptions,
  NonNullable<ArkBaseQueryMeta<BaseQuery>>,
  ArkBaseQueryApi<BaseQuery>
>

export const arkRetry: ArkBaseQueryEnhancer<unknown, RetryOptions, RetryOptions> = (baseQuery, retryConfig) => {
  const retryFn = retry(baseQuery, retryConfig)
  return (args, api, extraOptions) =>
    retryFn(args, api, extraOptions ?? ({} as ArkBaseQueryExtraOptions<typeof baseQuery> & RetryOptions))
}
