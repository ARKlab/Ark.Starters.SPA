import { Box, Flex, Heading, Input, Button } from "@chakra-ui/react";
import {
  ColumnDef,
  ColumnFiltersState,
  createColumnHelper,
} from "@tanstack/react-table";
import { Movie } from "./fakeMoviesData";
import { useGetMoviesQuery } from "./paginatedTableApi";
import { useState } from "react";
import { PaginatedSortableTable } from "../../components/PaginatedSortableTable/PaginatedSortableTable";
import { useTranslation } from "react-i18next";

const columnHelper = createColumnHelper<Movie>();

const MovieTableView = () => {
  const { t } = useTranslation();

  const columns = [
    columnHelper.accessor((row) => row.title, {
      id: "title",
      cell: (info) => info.getValue(),
      header: () => <span>{t("movies_title")}</span>,
      meta: { type: "string" }, //meta is custom data, if you want to expand this you can in the ex.ts file and add your custom properties.
      //enableColumnFilter: false, //Specify false if you don't want the filter
      enableColumnFilter: false,
    }),
    columnHelper.accessor((row) => row.director, {
      id: "director",
      cell: (info) => info.getValue(),
      header: () => <span>{t("movies_director")}</span>,
      meta: { type: "string" },
    }),
    columnHelper.accessor((row) => row.genre, {
      id: "genre",
      cell: (info) => info.getValue(),
      header: () => <span>{t("movies_genre")}</span>,
      meta: { type: "string" },
    }),
    columnHelper.accessor((row) => row.actors, {
      id: "actors",
      cell: (info) => info.getValue(),
      header: () => <span>{t("movies_actors")}</span>,
      meta: { type: "string" },
    }),
    columnHelper.accessor((row) => row.plot, {
      id: "plot",
      cell: (info) => info.getValue(),
      header: () => <span>{t("movies_plot")}</span>,
      meta: { type: "string" },
    }),
    columnHelper.accessor((row) => row.rating, {
      id: "rating",
      cell: (info) => "🍿".repeat(info.getValue() as number),
      header: () => <span>{t("movies_rating")}</span>,
      meta: { type: "number" },
    }),
    columnHelper.accessor((row) => row.releaseDate, {
      id: "releaseDate",
      cell: (info) => info.getValue(),
      header: () => <span>{t("movies_release")}</span>,
      meta: { type: "date" },
    }),
  ] as ColumnDef<Movie>[];
  const [filters, setFilters] = useState<ColumnFiltersState>([]);
  const [title, setTitle] = useState<string>("");
  const applyExtraFilter = () => {
    setFilters([
      {
        id: "title",
        value: title,
      },
    ]);
  };

  return (
    <Box>
      <Heading>{t("movies_movies")}</Heading>
      {/* 
          The next lines are an example of one external filter (the column title)
          This exemple is only dimostrative if you want to use external filters instead of column headers filters
          in the example when you apply the external filter, the column filter will be replaced completely.
          If you want to use both external and column filters, you have to merge the filters.
      */}
      <Flex my="2%" alignItems={"flex-start"} justifyItems={"center"}>
        <Input
          w="30%"
          placeholder={t("movies_externalfilterplaceholder")}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Flex>
      <Button marginBottom={"70px"} onClick={applyExtraFilter}>
        {t("movies_applyexternalfilter")}
      </Button>
      {/*External filters example end*/}

      <PaginatedSortableTable<Movie>
        columns={columns}
        useQueryHook={useGetMoviesQuery}
        isDraggable
        externalFilters
        externalFiltersState={filters}
      />
    </Box>
  );
};

export default MovieTableView;
