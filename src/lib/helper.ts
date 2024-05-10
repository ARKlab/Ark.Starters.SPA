/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { format } from "date-fns";
import * as R from "ramda";

export const formatDateToString = (date: Date | null, dateFormat?: string) => {
  if (!dateFormat) {
    dateFormat = "yyyy-MM-dd";
  }
  return date ? format(date, dateFormat) : "";
};

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const normalizeToArray = (val: string | number, list: any) => {
  const v = R.pathOr(null, [val], list);

  if (R.isNil(v)) return null;
  return R.isEmpty(v) || Array.isArray(v) ? v : [v];
};

export const queryStringBuilder = ({ filters }: { filters: object }) =>
  R.pipe(
    R.keys,
    R.map(key => builder({ key, data: filters, equator: "eq", join: "or" })),
    R.filter(x => !!x),
    R.join(" and "),
    encodeURIComponent,
    R.unless(R.isEmpty, x => `&$filter=${x}`),
  )(filters);

export const searchBuilder = ({ filters }: { filters: any }) =>
  R.pipe(
    R.keys,
    R.map(key => builder({ key, data: filters, equator: "=", join: "&" })),
    R.join("&"),
    R.unless(R.isEmpty, x => `&${x}`),
    R.unless(R.isEmpty, x => R.replace(/\B\s+|\s+\B/g, "", x)),
  )(filters);

const builder = ({
  key,
  data,
  equator,
  join,
}: {
  key: string | number | symbol;
  data: any;
  equator: string;
  join: string;
}) => {
  switch (keyType({ key, data })) {
    case "Array":
      return arrDataBuilder({ key, data: R.prop(key, data), equator, join });
    case "Object":
      return objDataBuilder({ data: R.prop(key, data), equator, join });
    case "Number":
    case "String": {
      const val = R.prop(key, data);
      const res = R.equals(equator, "eq") ? `'${val}'` : encodeURIComponent(val);
      return R.isEmpty(val) ? "" : `${String(key)} ${equator} ${res}`;
    }
    default:
      return "";
  }
};

const keyType = ({ key, data }: { key: string | number | symbol; data: any }) =>
  R.pipe(R.prop(key, data), R.type)(data);

const objDataBuilder = ({ data, equator, join }: { data: any; equator: string; join: string }) =>
  R.pipe(
    R.keys,
    R.map(key => `${String(key)} ${equator} '${R.prop(key, data)}'`),
    R.join(` ${join} `),
  )(data);

const arrDataBuilder = ({
  key,
  data,
  equator,
  join,
}: {
  key: string | number | symbol;
  data: Array<any>;
  equator: string;
  join: string;
}) => {
  switch (R.type(data[0])) {
    case "Object":
      return R.pipe(
        R.map(({ value }) => {
          const val = R.equals(equator, "eq") ? `'${value}'` : value;
          return `${String(key)} ${equator} ${val}`;
        }),
        R.values,
        R.join(` ${join} `),
      )(data);
    case "Number":
    case "String":
      return R.pipe(
        R.map((value: number | string) => {
          const val = R.equals(equator, "eq") ? `'${value}'` : value;
          return `${String(key)} ${equator} ${val}`;
        }),
        R.join(` ${join} `),
      )(data);
    default:
      return "";
  }
};
