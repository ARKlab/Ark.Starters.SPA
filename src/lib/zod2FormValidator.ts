import { z } from "zod";
import _ from "lodash";

/*
final form with form array error format:
{ "table": [ { "name": ["error 1"] } ] }
*/

export const zod2FormValidator = <T extends z.ZodTypeAny>(schema: T) => (values: Record<string, unknown>) => {
  const res = schema.safeParse(values);
  if (!res.success) {
    const errors = {};
    for (const err of res.error.errors) {
      _.set(errors, err.path, [err.message]);
    }
    return errors;
  }
  return undefined;
};

export const zod2FieldValidator = <T extends z.ZodTypeAny>(schema: T) => (value: unknown) => {
  const res = schema.safeParse(value);
  if (!res.success) {
    return res.error.formErrors.formErrors;
  }
  return undefined;
};
