import "@tanstack/react-table";
import { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    type: "string" | "number" | "boolean" | "date";
  }
}
