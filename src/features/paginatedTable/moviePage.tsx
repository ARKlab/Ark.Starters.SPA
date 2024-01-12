import { Box } from "@chakra-ui/react";
import { PaginatedSortableTable } from "../../componentsCommon/PaginatedSortableTable/PaginatedSortableTable";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  createColumnHelper,
} from "@tanstack/react-table";
import { Movie } from "./fakeMoviesData";
import { useGetMoviesQuery } from "./paginatedTableApi";

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

const MovieTableView = () => {
  return (
    <Box my="70px">
      <PaginatedSortableTable<Movie>
        columns={columns}
        useQueryHook={useGetMoviesQuery}
      />
    </Box>
  );
};

export default MovieTableView;
