/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { formatDateString, toISODateString } from "./i18n/formatDate";

const getType = (val: any): string => {
  return Object.prototype.toString.call(val).slice(8, -1);
};
const isEmpty = (val: any): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === "string" || Array.isArray(val)) return val.length === 0;
  if (typeof val === "object") return Object.keys(val).length === 0;
  return false;
};
export const formatDateToString = (date: Date | null, dateFormat?: string) => {
  dateFormat ??= "yyyy-MM-dd";

  if (!date) return "";
  
  // For ISO format, use native method
  if (dateFormat === "yyyy-MM-dd") {
    return toISODateString(date);
  }
  
  // For other formats, use the format string helper
  return formatDateString(date, dateFormat);
};

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const queryStringBuilder = ({ filters }: { filters: any }) => {
  const parts = Object.keys(filters)
    .map(key => builder({ key, data: filters, equator: "eq", join: "or" }))
    .filter(x => !!x);

  if (parts.length === 0) return "";

  const joined = parts.join(" and ");
  const encoded = encodeURIComponent(joined);
  return `&$filter=${encoded}`;
};

export const searchBuilder = ({ filters }: { filters: any }) => {
  const parts = Object.keys(filters).map(key => builder({ key, data: filters, equator: "=", join: "&" }));

  const joined = parts.join("&");

  if (!joined) return "";

  const result = `&${joined}`;

  return result.replace(/\B\s+|\s+\B/g, "");
};

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
  const val = data[key];
  const type = getType(val);

  switch (type) {
    case "Array":
      return arrDataBuilder({ key, data: val, equator, join });
    case "Object":
      return objDataBuilder({ data: val, equator, join });
    case "Number":
    case "String": {
      const res = equator === "eq" ? `'${val}'` : encodeURIComponent(val);
      return isEmpty(val) ? "" : `${String(key)} ${equator} ${res}`;
    }
    default:
      return "";
  }
};

const objDataBuilder = ({ data, equator, join }: { data: any; equator: string; join: string }) => {
  return Object.keys(data)
    .map(key => `${key} ${equator} '${data[key]}'`)
    .join(` ${join} `);
};

const arrDataBuilder = ({
  key,
  data,
  equator,
  join,
}: {
  key: string | number | symbol;
  data: any[];
  equator: string;
  join: string;
}) => {
  if (data.length === 0) return "";
  const firstItemType = getType(data[0]);

  switch (firstItemType) {
    case "Object":
      return data
        .map((item: any) => {
          const { value } = item;
          const val = equator === "eq" ? `'${value}'` : value;
          return `${String(key)} ${equator} ${val}`;
        })
        .join(` ${join} `);
    case "Number":
    case "String":
      return data
        .map((value: number | string) => {
          const val = equator === "eq" ? `'${value}'` : value;
          return `${String(key)} ${equator} ${val}`;
        })
        .join(` ${join} `);
    default:
      return "";
  }
};

/**
 * This is the "whole set" validator for the form. of course for us is a table but it is in fact a form
 * In our configuration pattern this would be primarily used for primary key validation so i made it generic to accept a list of props
 * to check for combinations of duplicates
 * @param propsToCheck
 * @returns
 */
export function primaryKeyValidator<T>(propsToCheck: (keyof T)[]) {
  return (values: { table?: T[] }) => {
    const table = values.table;

    if (!table) return null;

    const errors: { table?: { _rowError?: string[] }[] } = {};

    const seen = new Map<string, number[]>();

    table.forEach((row, index) => {
      // Build key <Prop1Value>|<Prop2Value>|...|<PropNValue>
      const key = propsToCheck.map(prop => row[prop]).join("|");

      if (seen.has(key)) {
        seen.get(key)?.push(index);
      } else {
        seen.set(key, [index]);
      }
    });

    seen.forEach(indexes => {
      if (indexes.length > 1) {
        indexes.forEach(index => {
          errors.table = errors.table ?? [];
          errors.table[index] = errors.table[index] || { _rowError: [] };
          errors.table[index]._rowError?.push(
            `Duplicate ${propsToCheck.join(", ")} values found at indexes: ${indexes.join(", ")}`,
          );
        });
      }
    });

    return errors.table?.length ? errors : null;
  };
}
