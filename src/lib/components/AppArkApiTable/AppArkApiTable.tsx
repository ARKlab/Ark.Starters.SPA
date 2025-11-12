import { Box, Button, Center, HStack, Spinner, Table, VStack } from "@chakra-ui/react";
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  OnChangeFn,
  PaginationState,
  Table as ReactTable,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { DebouncedInputColumnHeader } from "../../../components/debouncedInputColumnHeader";
import type { ListResponse } from "../../apiTypes";
import { ChackraDateRangeInHeader } from "../AppDateRange/chackraDateRangeInHeader";
import AppPagination from "../AppPagination/AppPagination";

import { ColumnSorter } from "./columnSorter";
import { DraggableColumnHeader } from "./draggableColumnHeader";
import { getTableState, setTableState } from "./tableStateSlice";

type ArkApiTableProps<T> = {
  columns: ColumnDef<T>[];
  useQueryHook: (
    args: { pageIndex: number; pageSize: number; sorting: SortingState; filters: ColumnFiltersState },
    options: { skip: boolean },
  ) => {
    data?: ListResponse<T>;
    isLoading: boolean;
    isFetching: boolean;
  };
  isDraggable?: boolean;
  isSortable?: boolean;
  disableHeaderFilters?: boolean;
  externalFilters?: boolean;
  externalFiltersState?: ColumnFiltersState;
  setRowSelection?: OnChangeFn<T[]> | ((rows: T[]) => void);
  selectedRows?: RowSelectionState;
  pageSize?: number;
  getRowId?: (row: T) => string;
  defaultSorting?: SortingState;
  skipQuery?: boolean; //set this to true if you want the useQueryHook to be skipped
  extractPagination?: (pagination: PaginationState) => void;
  tableKey: string;
  overWriteStore?: boolean; //if true, when setting the table state in the store, it will overwrite all other table states. Deafault is true. Could be usueful when you have multiple tables in the same page and you want to retain filters for all of them
};

export function AppArkApiTable<T>(props: ArkApiTableProps<T>) {
  const {
    columns,
    useQueryHook,
    isDraggable,
    disableHeaderFilters,
    externalFilters,
    externalFiltersState,
    isSortable = true,
    setRowSelection,
    selectedRows,
    pageSize: pageSizeProp,
    getRowId,
    defaultSorting,
    skipQuery: skip = false,
    extractPagination,
    tableKey,
  } = props;
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: pageSizeProp ?? 10,
  });
  const reduxTableState = useAppSelector(state => getTableState(state, tableKey));
  const filtersAreEquals = JSON.stringify(reduxTableState?.filters) === JSON.stringify(externalFiltersState);
  const dispatch = useAppDispatch();
  const [sortingState, setSorting] = useState<SortingState>(defaultSorting ?? [{ id: "", desc: false }]);
  const [rowIndexSelection, setRowIndexSelection] = useState<RowSelectionState>(selectedRows ?? {}); //this is the state of the selected rows
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  //When filters are provided externally, we use them instead of the internal state
  useEffect(() => {
    if (externalFilters) {
      setColumnFilters(externalFiltersState ?? []);
      setPagination({
        pageIndex: 1,
        pageSize: pageSizeProp ?? 10,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalFilters, externalFiltersState]);

  useEffect(() => {
    const storeFilters = {
      filters: columnFilters,
      pagination: { pageIndex, pageSize },
      sorting: sortingState,
    };

    if (!filtersAreEquals && tableKey) {
      dispatch(setTableState({ key: tableKey, tableState: storeFilters, overWrite: props.overWriteStore ?? true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters, pageIndex, pageSize, sortingState, tableKey]);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.filter((x): x is ColumnDef<T> & { id: string } => x.id !== undefined).map(column => column.id), //must start out with populated columnOrder so we can splice
  );

  const resetOrder = () => {
    setColumnOrder(
      columns.filter((x): x is ColumnDef<T> & { id: string } => x.id !== undefined).map(column => column.id),
    );
  };

  const { data, isLoading, isFetching } = useQueryHook(
    {
      pageIndex,
      pageSize,
      sorting: sortingState,
      filters: columnFilters,
    },
    { skip }, // Skip the query if the skip prop is true
  );

  const tableData: T[] = data?.data ?? [];
  useEffect(() => {
    if (!getRowId) {
      return;
    }

    const selectedIds = Object.keys(rowIndexSelection).filter(key => rowIndexSelection[key]); // Get selected row IDs

    const rows = selectedIds
      .map(id => data?.data.find(row => getRowId(row) === id)) // Find rows by ID
      .filter(row => row !== undefined) as T[]; // Filter out undefined rows

    if (setRowSelection) setRowSelection(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowIndexSelection, data?.data]);
  // useMemo is used here to optimize performance by memoizing the sorting and pagination states.
  // This avoids unnecessary re-renders and computations if these states do not change between renders.
  const sorting = useMemo(() => sortingState, [sortingState]);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );
  const { t } = useTranslation();
  const table = useReactTable<T>({
    //this is the definition of the table
    data: tableData,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(tableData.length / pageSize),
    //this is the state of the table (table.getState()) we take care of it manually to have all features server side and ARK compatibile
    state: {
      pagination,
      sorting,
      columnFilters,
      columnOrder,
      rowSelection: rowIndexSelection,
    },
    getRowId: getRowId,
    enableRowSelection: setRowSelection ? true : false,
    onRowSelectionChange: setRowIndexSelection,
    //these onChanges are the state setters
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(), //this is the core row model, it is used to get the rows that are visible after filtering, sorting and pagination
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true, //manual xxx means that Tanstack (React Table v8) expects that we take care of the table state manually
    manualSorting: true,
    enableSorting: isSortable,
    enableColumnFilters: true,
    enableFilters: true,
    manualFiltering: true,
  });

  const onPageIndexChange = (pageIndex: number) => {
    setPagination(prevState => ({ ...prevState, pageIndex: pageIndex }));
    extractPagination?.({ ...pagination, pageIndex: pageIndex });
    /*
    this is the solution we found to set the state in a manual pagination system. 
    normally you would doi something like this: table.setPageIndex(pageIndex) but that is not working 
    probably because of the manualPagination: true,.
 
    */
  };
  const onPageSizeChange = (pageSize: number) => {
    setPagination(prevState => ({ ...prevState, pageSize: pageSize }));
    extractPagination?.({ ...pagination, pageSize: pageSize });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box overflowX="auto">
        <Button onClick={resetOrder} hidden={!isDraggable}>
          {/*This should be only demostrative and should be outside of the component*/}
          {t("movies_resetcolumnsorder")}
        </Button>
        <Table.ScrollArea>
          <Table.Root stickyHeader mb={"6"}>
            <Table.Header>
              {table.getHeaderGroups().map(headerGroup => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <Table.ColumnHeader key={header.id} verticalAlign="top">
                      {header.isPlaceholder ? null : (
                        <>
                          <VStack gap="2" align="start" justify="space-between">
                            <HStack gap="1">
                              <Box>
                                {isDraggable ? (
                                  <DraggableColumnHeader key={header.id} header={header} table={table} />
                                ) : (
                                  flexRender(header.column.columnDef.header, header.getContext())
                                )}
                              </Box>
                              <ColumnSorter column={header.column} />
                            </HStack>
                            <Box>
                              {header.column.getCanFilter() && !disableHeaderFilters ? (
                                <Filter<T> column={header.column} table={table} isLoading={isFetching} />
                              ) : null}
                            </Box>
                          </VStack>
                        </>
                      )}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              ))}
            </Table.Header>
            <Table.Body>
              {isLoading || isFetching ? (
                <Table.Row>
                  <Table.Cell colSpan={columns.length}>
                    <Center>
                      <Spinner data-role="spinner" />
                    </Center>
                  </Table.Cell>
                </Table.Row>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <Table.Row key={row.id} _hover={{ bg: "brand.selected" }}>
                    {row.getVisibleCells().map(cell => (
                      <Table.Cell py={"1"} key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={columns.length}>
                    <Center>No data</Center>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
        <AppPagination
          page={table.getState().pagination.pageIndex}
          pageSize={table.getState().pagination.pageSize}
          count={data?.count ?? 0}
          onPageChange={onPageIndexChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isFetching}
        />
      </Box>
    </DndProvider>
  );
}

function Filter<T>({ column }: { column: Column<T>; table: ReactTable<T>; isLoading: boolean }) {
  const columnFilterValue = column.getFilterValue();
  const columnFacetedUniqueValues = column.getFacetedUniqueValues();

  const sortedUniqueValues = useMemo(() => {
    switch (column.columnDef.meta?.type) {
      case "string":
        return Array.from(columnFacetedUniqueValues.keys())
          .sort()
          .map(x => String(x));
      default:
        return [];
    }
  }, [column, columnFacetedUniqueValues]);

  //You can add all the filters you need and want here, even multiple per column (min max for numbers for example)
  switch (column.columnDef.meta?.type) {
    case "date":
      return <ChackraDateRangeInHeader />;
    case "number":
    case "string":
      return (
        <>
          <datalist id={column.id + "list"}>
            {sortedUniqueValues.slice(0, 5000).map(value => (
              <option value={value} key={value} />
            ))}
          </datalist>
          <DebouncedInputColumnHeader
            type="text"
            value={(columnFilterValue ?? "") as string}
            onChange={value => {
              column.setFilterValue(value);
            }}
            placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
            className="w-36 border shadow rounded"
            list={column.id + "list"}
          />
        </>
      );
    default:
      return <></>;
  }
}
