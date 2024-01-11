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
import React, { useMemo, useState } from "react";
import ChackraPaginationComponent from "../../componentsCommon/chackraPaginationComponent/chackraTablePagination";
import { Movie } from "./fakeMoviesData";
import { useGetMoviesQuery } from "./paginatedTableApi";
import {
  Column,
  Table as ReactTable,
  ColumnDef,
  ColumnSort,
  PaginationState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<Movie>();

const columns = [
  columnHelper.accessor((row) => row.title, {
    id: "title",
    cell: (info) => info.getValue(),
    header: () => <span>Title</span>,
    enableColumnFilter: true,
  }),
  columnHelper.accessor((row) => row.director, {
    id: "director",
    cell: (info) => info.getValue(),
    header: () => <span>Director</span>,
  }),
  columnHelper.accessor((row) => row.genre, {
    id: "genre",
    cell: (info) => info.getValue(),
    header: () => <span>Genre</span>,
  }),
  columnHelper.accessor((row) => row.actors, {
    id: "actors",
    cell: (info) => info.getValue(),
    header: () => <span>Actors</span>,
  }),
  columnHelper.accessor((row) => row.plot, {
    id: "plot",
    cell: (info) => info.getValue(),
    header: () => <span>Plot</span>,
  }),
  columnHelper.accessor((row) => row.rating, {
    id: "rating",
    cell: (info) => "🍿".repeat(info.getValue() as number),
    header: () => <span>Rating</span>,
  }),
] as ColumnDef<Movie>[];

export function MoviesTable() {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const [sortingState, setSorting] = useState<SortingState>([
    { id: "", desc: false },
  ]);

  const { data, error, isLoading, isFetching } = useGetMoviesQuery({
    pageIndex,
    pageSize,
    sorting: sortingState,
  });

  const tableData: Movie[] = data?.data as Movie[];
  const sorting = useMemo(() => sortingState, [sortingState]);
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable<Movie>({
    data: tableData,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: tableData?.length ? Math.ceil(tableData.length / pageSize) : 0,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    debugTable: true,
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
    <Box overflowX="auto">
      <Heading>Movies</Heading>

      <Table variant="simple" my="30px">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <Box
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </Box>
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
                  <Spinner />
                </Center>
              </Td>
            </Tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: ReactTable<any>;
}) {
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
      <Box className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </Box>
      <Box className="h-1" />
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
    />
  );
}
