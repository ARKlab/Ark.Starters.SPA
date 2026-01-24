import z from "zod"
/*
  form with form array error format:
  { "table": [ { "name": ["error 1"] } ] }
*/

/**
 * Sets a value at a given path in an object
 * @param obj - The object to modify
 * @param path - The path to set (string or array of keys)
 * @param value - The value to set
 */
function setNestedValue(obj: Record<string, unknown>, path: string | (string | number)[], value: unknown): void {
  const keys = Array.isArray(path) ? path : path.split(".")
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = String(keys[i])
    if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
      // Determine if next key is a number (array index)
      const nextKey = keys[i + 1]
      current[key] = typeof nextKey === "number" ? [] : {}
    }
    current = current[key] as Record<string, unknown>
  }

  const lastKey = String(keys[keys.length - 1])
  current[lastKey] = value
}

export const zod2FormValidator = (schema: z.ZodType) => (values: Record<string, unknown>) => {
  const res = schema.safeParse(values)
  if (!res.success) {
    const errors = {}
    for (const err of res.error.issues) {
      const index = typeof err.path[1] === "number" ? err.path[1] : 0
      const path = String(err.path[0])
      setNestedValue(errors, path, [err.message + " at index " + index])
    }
    return errors
  }
  return undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const zod2FieldValidator = (schema: z.ZodType) => (value: any) => {
  const res = schema.safeParse(value)
  if (!res.success) {
    const err = z.prettifyError(res.error)
    return err
  }
  return undefined
}
