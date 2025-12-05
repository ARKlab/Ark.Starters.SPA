/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RowData, ColumnFiltersState } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    type: "string" | "number" | "boolean" | "date";
  }
}

export function toColumnFiltersState(filters: Record<PropertyKey, unknown>): ColumnFiltersState {
  return Object.entries(filters)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ({
      id: key,
      value,
    }));
}
