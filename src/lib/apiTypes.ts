import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

export interface ListResponse<T> extends ListQueryParams {
  data: T[];
  count: number;
}

export interface ListQueryParams {
  page: number;
  limit: number;
}

export type ArkPagedQueryParameters = {
  filters?: ColumnFiltersState;
  pageIndex?: number;
  pageSize?: number;
  sorting?: SortingState;
};
