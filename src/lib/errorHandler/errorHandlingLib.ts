//ref: https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(error: unknown): error is { message: string } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof error === "object" && error != null && "message" in error && typeof (error as any).message === "string";
}
