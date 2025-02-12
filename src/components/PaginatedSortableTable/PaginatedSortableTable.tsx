import { Box, Button, Center, HStack, Spinner, Table, Tbody, Td, Th, Thead, Tr, VStack } from "@chakra-ui/react";
import type {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  PaginationState,
  Table as ReactTable,
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

import type { ListResponse } from "../../lib/apiTypes";
import { ChackraDateRangeInHeader } from "../chackraDateRange/chackraDateRangeInHeader";
import PaginationComponent from "../chackraPaginationComponent/chackraTablePagination";
import { DebouncedInputColumnHeader } from "../debouncedInputColumnHeader";

import { ColumnSorter } from "./ColumnSorter";
import { DraggableColumnHeader } from "./draggableColumnHeader";

type PaginatedSortableTableProps<T> = {
  columns: ColumnDef<T>[];
  useQueryHook: (args: { pageIndex: number; pageSize: number; sorting: SortingState; filters: ColumnFiltersState }) => {
    data?: ListResponse<T>;
    isLoading: boolean;
    isFetching: boolean;
  };
  isDraggable?: boolean;
  isSortable?: boolean;
  disableHeaderFilters?: boolean;
  externalFilters?: boolean;
  externalFiltersState?: ColumnFiltersState;
};

export function PaginatedSortableTable<T>(props: PaginatedSortableTableProps<T>) {
  const {
    columns,
    useQueryHook,
    isDraggable,
    disableHeaderFilters,
    externalFilters,
    externalFiltersState,
    isSortable = true,
  } = props;
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const [sortingState, setSorting] = useState<SortingState>([{ id: "", desc: false }]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  //When filters are provided externally, we use them instead of the internal state
  useEffect(() => {
    if (externalFilters) {
      setColumnFilters(externalFiltersState ?? []);
    }
  }, [externalFilters, externalFiltersState]);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    columns.filter(x => x.id != undefined).map(column => column.id!), //must start out with populated columnOrder so we can splice
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const resetOrder = () => {
    setColumnOrder(columns.filter(x => x.id != undefined).map(column => column.id!));
  };

  const { data, isLoading, isFetching } = useQueryHook({
    pageIndex,
    pageSize,
    sorting: sortingState,
    filters: columnFilters,
  });

  const tableData: T[] = data?.data ?? [];

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
    },
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
    /*
    this is the solution we found to set the state in a manual pagination system. 
    normally you would doi something like this: table.setPageIndex(pageIndex) but that is not working 
    probably because of the manualPagination: true,.
 
    */
  };
  const onPageSizeChange = (pageSize: number) => {
    setPagination(prevState => ({ ...prevState, pageSize: pageSize }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box overflowX="auto">
        <Button onClick={resetOrder} hidden={!isSortable}>
          {/*This should be only demostrative and should be outside of the component*/}
          {t("movies_resetcolumnsorder")}
        </Button>
        <Table variant="simple" my="30px" minHeight={"500px"}>
          <Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Th key={header.id} verticalAlign="top">
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
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {isLoading || isFetching ? (
              <Tr>
                <Td colSpan={columns.length}>
                  <Center>
                    <Spinner data-role="spinner" />
                  </Center>
                </Td>
              </Tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                  ))}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length}>
                  <Center>No data</Center>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        <PaginationComponent
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

function Filter<T>({ column, isLoading }: { column: Column<T>; table: ReactTable<T>; isLoading: boolean }) {
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
      return <ChackraDateRangeInHeader onChange={column.setFilterValue} isLoading={isLoading} />;
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
