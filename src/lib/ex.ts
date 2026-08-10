/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CellData, ColumnFiltersState, RowData, TableFeatures } from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > {
    type: "string" | "number" | "boolean" | "date"
  }
}

export function toColumnFiltersState(filters: Record<PropertyKey, unknown>): ColumnFiltersState {
  return Object.entries(filters)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ({
      id: key,
      value,
    }))
}
