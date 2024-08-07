import { set } from "lodash-es";
import type { z } from "zod";

/*
final form with form array error format:
{ "table": [ { "name": ["error 1"] } ] }
*/

export const zod2FormValidator = (schema: z.ZodTypeAny) => (values: Record<string, unknown>) => {
  const res = schema.safeParse(values);
  if (!res.success) {
    const errors = {};
    for (const err of res.error.errors) {
      set(errors, err.path, [err.message]);
    }
    return errors;
  }
  return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const zod2FieldValidator = (schema: z.ZodTypeAny) => (value: any) => {
  const res = schema.safeParse(value);
  if (!res.success) {
    return res.error.formErrors.formErrors;
  }
  return undefined;
};
