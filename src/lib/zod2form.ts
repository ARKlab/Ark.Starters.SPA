import * as z from "zod";
import _ from "lodash";

/*
final form with form array error format:
{
  "name": {
    "3": ["Error message for name at index 3"],
    "5": ["Error message for name at index 5"]
  },
  "surName": {
    "2": ["Error message for surName at index 2"],
    "3": ["Error message for surName at index 3"]
  },
  "_error": ["FormValidator error message"]
}
*/
export const zod2FormValidator =
  <T extends z.ZodType<any, any>>(schema: T) =>
  (values: Record<string, any>) => {
    var res = schema.safeParse(values);
    if (!res.success) {
      var errors = {};
      for (const err of res.error.errors) {
        _.set(errors, err.path, [err.message]);
      }
      return errors;
    }
    return undefined;
  };

export const zod2FieldValidator =
  <T extends z.ZodType<any, any>>(schema: T) =>
  (value: unknown) => {
    var res = schema.safeParse(value);
    if (!res.success) {
      return res.error.formErrors.formErrors;
    }
    return undefined;
  };
