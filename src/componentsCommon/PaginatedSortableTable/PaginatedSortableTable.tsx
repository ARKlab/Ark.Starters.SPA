import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { FC, useMemo, useState } from "react";
import ChackraPaginationComponent from "../chackraPaginationComponent/chackraTablePagination";

import { useGetMoviesQuery } from "../../features/paginatedTable/paginatedTableApi";
import {
  Column,
  Table as ReactTable,
  ColumnDef,
  ColumnSort,
  PaginationState,
  SortingState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  ColumnOrderState,
  Header,
} from "@tanstack/react-table";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function PaginatedSortableTable<T>(props: {
  columns: ColumnDef<T>[];
  useQueryHook: (args: {
    pageIndex: number;
    pageSize: number;
    sorting: SortingState;
    filters: ColumnFiltersState;
  }) => any;
}) {
  const { columns, useQueryHook } = props;
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

  const sorting = useMemo(() => sortingState, [sortingState]);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );
  const filtering = useMemo(() => columnFilters, [columnFilters]);

  const table = useReactTable<T>({
    data: tableData,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: tableData ? Math.ceil(tableData.length / pageSize) : 0,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    enableColumnFilters: true,
    enableFilters: true,
    manualFiltering: true,
  });

  const onPageIndexChange = (pageIndex: number) => {
    setPagination((prevState) => ({ ...prevState, pageIndex: pageIndex }));
  };
  const onPageSizeChange = (pageSize: number) => {
    setPagination((prevState) => ({ ...prevState, pageSize: pageSize }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box overflowX="auto">
        <Heading>Movies</Heading>

        <Table variant="simple" my="30px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <>
                        <Box
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {
                            <DraggableColumnHeader
                              key={header.id}
                              header={header}
                              table={table}
                            />
                            /*flexRender(
                          header.column.columnDef.header,
                          header.getContext())*/
                          }
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </Box>
                        {header.column.getCanFilter() ? (
                          <Box>
                            <Filter<T> column={header.column} table={table} />
                          </Box>
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
            ) : (
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
            )}
          </Tbody>
        </Table>
        <ChackraPaginationComponent
          page={table.getState().pagination.pageIndex}
          pageSize={table.getState().pagination.pageSize}
          count={data?.count || 0}
          onPageChange={onPageIndexChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading || isFetching}
        />
      </Box>
    </DndProvider>
  );
}

function Filter<T>({
  column,
  table,
}: {
  column: Column<T, unknown>;
  table: ReactTable<T>;
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

  return typeof firstValue === "number" ? (
    <Box>
      <Box>
        <DebouncedInput
          type="number"
          value={(columnFilterValue as number) ?? ""}
          onChange={(value) => column.setFilterValue(value)}
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </Box>
      <Box />
    </Box>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
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

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "size">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size={"sm"}
    />
  );
}

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  );
  return [...columnOrder];
};

const DraggableColumnHeader = <T,>(props: {
  header: Header<T, unknown>;
  table: ReactTable<T>;
}) => {
  const { header, table } = props;
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;

  const [, dropRef] = useDrop({
    accept: "column",
    drop: (draggedColumn: Column<T>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder
      );
      setColumnOrder(newColumnOrder);
    },
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: "column",
  });

  return (
    <th
      ref={dropRef}
      colSpan={header.colSpan}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Box ref={previewRef}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        <button ref={dragRef}>🟰</button>
      </Box>
    </th>
  );
};
