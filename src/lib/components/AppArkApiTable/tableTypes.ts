import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

export type TableState = {
  filters: ColumnFiltersState;
  pagination: PaginationState;
  sorting: SortingState;
};
