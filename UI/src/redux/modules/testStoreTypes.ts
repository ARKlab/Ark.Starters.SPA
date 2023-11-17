import * as t from "io-ts";

export const testRedux = t.type({
  id: t.union([t.number, t.null]),
  auditId: t.union([t.string, t.null]),
});

export const testReduxDataType = t.type({
  skip: t.union([t.number, t.null]),
  limit: t.union([t.number, t.null]),
  data: t.array(t.union([testRedux, t.null])),
});

const testReduxFiltersFields = t.type({
  name: t.union([t.string, t.null]),
});

export const testReduxFilters = t.type({
  filters: testReduxFiltersFields,
  pageSize: t.union([t.number, t.null]),
  page: t.union([t.number, t.null]),
});

export const testReduxTypeDecoder = testReduxDataType;
export type testReduxType = t.TypeOf<typeof testReduxDataType>;
export type testReduxFiltersType = t.TypeOf<typeof testReduxFilters>;
