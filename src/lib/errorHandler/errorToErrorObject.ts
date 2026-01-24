/**
 * Converts an unknown error value to an Error object.
 * This is useful when working with error boundaries that receive unknown errors.
 *
 * @param error - The error value to convert (can be Error, string, or any other type)
 * @returns An Error object
 */
export function errorToErrorObject(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  return new Error(String(error))
}
