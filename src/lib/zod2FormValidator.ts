import { set } from "lodash-es";
import z from "zod";
/*
  form with form array error format:
  { "table": [ { "name": ["error 1"] } ] }
*/

export const zod2FormValidator = (schema: z.ZodType) => (values: Record<string, unknown>) => {
  const res = schema.safeParse(values);
  if (!res.success) {
    const errors = {};
    for (const err of res.error.issues) {
      const index = typeof err.path[1] === "number" ? err.path[1] : 0;
      const path = err.path[0];
      set(errors, path, [err.message + " at index " + index]);
    }
    return errors;
  }
  return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const zod2FieldValidator = (schema: z.ZodType) => (value: any) => {
  const res = schema.safeParse(value);
  if (!res.success) {
    const err = z.prettifyError(res.error);
    return err;
  }
  return undefined;
};
