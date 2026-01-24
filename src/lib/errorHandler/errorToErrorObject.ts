/**
 * Converts an unknown error value to an Error object.
 * This is useful when working with error boundaries that receive unknown errors.
 *
 * @param error - The error value to convert (can be Error, string, null, undefined, or any other type)
 * @returns An Error object. If error is null or undefined, returns an Error with message "Unknown error"
 */
export function errorToErrorObject(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  if (error == null) {
    return new Error("Unknown error")
  }
  // Handle objects (including functions) - try to serialize
  if (typeof error === "object" || typeof error === "function") {
    try {
      return new Error(JSON.stringify(error))
    } catch {
      return new Error("[Error object could not be serialized]")
    }
  }
  // Handle primitives (string, number, boolean, symbol, bigint)
  // At this point, error must be a primitive type, safe to convert to string
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
  return new Error(`${error}`)
}
