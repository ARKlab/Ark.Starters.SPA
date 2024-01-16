import {
  Box,
  Button,
  Center,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import ChackraPaginationComponent from "../chackraPaginationComponent/chackraTablePagination";

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  PaginationState,
  Table as ReactTable,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DebouncedInputColumnHeader } from "../debouncedInputColumnHeader";
import { ChackraDateRangeInHeader } from "../chackraDateRange/chackraDateRangeInHeader";
import { DraggableColumnHeader } from "./draggableColumnHeader";
type PaginatedSortableTableProps<T> = {
  columns: ColumnDef<T>[];
  useQueryHook: (args: {
    pageIndex: number;
    pageSize: number;
    sorting: SortingState;
    filters: ColumnFiltersState;
  }) => any;
  isDraggable?: boolean;
  disableHeaderFilters?: boolean;
  externalFilters?: boolean;
  externalFiltersState?: ColumnFiltersState;
};

export function PaginatedSortableTable<T>(
  props: PaginatedSortableTableProps<T>
) {
  const {
    columns,
    useQueryHook,
    isDraggable,
    disableHeaderFilters,
    externalFilters,
    externalFiltersState,
  } = props;
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const [sortingState, setSorting] = useState<SortingState>([
    { id: "", desc: false },
  ]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  //When filters are provided externally, we use them instead of the internal state
  React.useEffect(() => {
    if (externalFilters) {
      setColumnFilters(externalFiltersState || []);
    }
  }, [externalFilters, externalFiltersState]);

  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    columns.map((column) => column.id as string) //must start out with populated columnOrder so we can splice
  );

  const resetOrder = () =>
    setColumnOrder(columns.map((column) => column.id as string));

  const { data, error, isLoading, isFetching } = useQueryHook({
    pageIndex,
    pageSize,
    sorting: sortingState,
    filters: columnFilters,
  });

  const tableData: T[] = data && data.data ? (data.data as T[]) : [];

  // useMemo is used here to optimize performance by memoizing the sorting and pagination states.
  // This avoids unnecessary re-renders and computations if these states do not change between renders.
  const sorting = useMemo(() => sortingState, [sortingState]);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const table = useReactTable<T>({
    //this is the definition of the table
    data: tableData,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: tableData ? Math.ceil(tableData.length / pageSize) : 0,
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
    enableColumnFilters: true,
    enableFilters: true,
    manualFiltering: true,
  });

  const onPageIndexChange = (pageIndex: number) => {
    setPagination((prevState) => ({ ...prevState, pageIndex: pageIndex }));
    /*
    this is the solution we found to set the state in a manual pagination system. 
    normally you would doi something like this: table.setPageIndex(pageIndex) but that is not working 
    probably because of the manualPagination: true,.

    */
  };
  const onPageSizeChange = (pageSize: number) => {
    setPagination((prevState) => ({ ...prevState, pageSize: pageSize }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box overflowX="auto">
        <Button onClick={resetOrder}>Reset Columns Order</Button>
        <Table variant="simple" my="30px" minHeight={"500px"}>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <span
                          style={{
                            cursor: header.column.getCanSort() ? "pointer" : "",
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {isDraggable ? (
                            <DraggableColumnHeader
                              key={header.id}
                              header={header}
                              table={table}
                            />
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>
                        {header.column.getCanFilter() &&
                        !disableHeaderFilters ? (
                          <span>
                            <Filter<T>
                              column={header.column}
                              table={table}
                              isLoading={isFetching}
                            />
                          </span>
                        ) : null}
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
                <Td colSpan={columns ? columns.length : 1}>
                  <Center>
                    <Spinner />
                  </Center>
                </Td>
              </Tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
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
        <ChackraPaginationComponent
          page={table.getState().pagination.pageIndex}
          pageSize={table.getState().pagination.pageSize}
          count={data?.count || 0}
          onPageChange={onPageIndexChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isFetching}
        />
      </Box>
    </DndProvider>
  );
}

function Filter<T>({
  column,
  table,
  isLoading,
}: {
  column: Column<T, unknown>;
  table: ReactTable<T>;
  isLoading: boolean;
}) {
  if (table.getPreFilteredRowModel() === undefined) return <></>;
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  //You can add all the filters you need and want here, even multiple per column (min max for numbers for example)
  switch (column.columnDef.meta?.type) {
    case "date":
      return (
        <ChackraDateRangeInHeader
          onChange={column.setFilterValue}
          isLoading={isLoading}
        />
      );
    case "number":
    case "string":
      return (
        <>
          <datalist id={column.id + "list"}>
            {sortedUniqueValues.slice(0, 5000).map((value: any) => (
              <option value={value} key={value} />
            ))}
          </datalist>
          <DebouncedInputColumnHeader
            type="text"
            value={(columnFilterValue ?? "") as string}
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
            className="w-36 border shadow rounded"
            list={column.id + "list"}
          />
          <Box className="h-1" />
        </>
      );
  }
}
