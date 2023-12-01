import * as R from "ramda";

export const normalizeToArray = (val: any, list: any) => {
  const v = R.pathOr(null, [val], list);

  if (R.isNil(v)) return null;
  return R.isEmpty(v) || Array.isArray(v) ? v : [v];
};

export const queryStringBuilder = ({ filters }: { filters: any }) =>
  R.pipe(
    R.keys,
    R.map((key: any) =>
      builder({ key, data: filters, equator: "eq", join: "or" })
    ),
    R.filter((x: any) => x),
    R.join(" and "),
    encodeURIComponent,
    R.unless(R.isEmpty, (x) => `&$filter=${x}`)
  )(filters);

export const searchBuilder = ({ filters }: { filters: any }) =>
  R.pipe(
    R.keys,
    R.map((key: any) =>
      builder({ key, data: filters, equator: "=", join: "&" })
    ),
    R.filter((x: any) => x),
    R.join("&"),
    R.unless(R.isEmpty, (x) => `&${x}`),
    R.unless(R.isEmpty, (x) => R.replace(/\B\s+|\s+\B/g, "", x))
  )(filters);

const builder = ({
  key,
  data,
  equator,
  join,
}: {
  key: string;
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
      const res = R.equals(equator, "eq")
        ? `'${val}'`
        : encodeURIComponent(val);
      return R.isEmpty(val) ? "" : `${key} ${equator} ${res}`;
    }
    default:
      return "";
  }
};

const keyType = ({ key, data }: { key: string; data: any }) =>
  R.pipe(R.prop<any, any>(key), R.type)(data);

const objDataBuilder = ({
  data,
  equator,
  join,
}: {
  data: any;
  equator: string;
  join: string;
}) =>
  R.pipe(
    R.keys,
    R.map((key: any) => `${key} ${equator} '${R.prop(key, data)}'`),
    R.join(` ${join} `)
  )(data);

const arrDataBuilder = ({
  key,
  data,
  equator,
  join,
}: {
  key: string;
  data: any;
  equator: string;
  join: string;
}) => {
  switch (R.type(data[0])) {
    case "Object":
      return R.pipe(
        R.map(({ value }: { value: string }) => {
          const val = R.equals(equator, "eq") ? `'${value}'` : value;
          return `${key} ${equator} ${val}`;
        }),
        R.values,
        R.join(` ${join} `)
      )(data);
    case "Number":
    case "String":
      return R.pipe(
        R.map((value: any) => {
          const val = R.equals(equator, "eq") ? `'${value}'` : value;
          return `${key} ${equator} ${val}`;
        }),
        R.join(` ${join} `)
      )(data);
    default:
      return "";
  }
};
