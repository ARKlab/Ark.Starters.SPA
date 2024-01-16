export interface ListResponse<T> extends ListQueryParams {
  data: T[];
  count: number;
}

export interface ListQueryParams {
  page: number;
  limit: number;
}
