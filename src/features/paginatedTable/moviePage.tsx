import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LuFilter } from "react-icons/lu";

import { useAppDispatch } from "../../app/hooks";
import { useInjectApiSlice } from "../../app/useInjectApiSlice";
import { AppFilters } from "../../components/AppFilters/AppFilters";
import type { FilterDefinition } from "../../components/AppFilters/Filters";
import { AppArkApiTable } from "../../lib/components/AppArkApiTable/AppArkApiTable";
import { toColumnFiltersState } from "../../lib/ex";

import type { Movie } from "./fakeMoviesData";
import { moviesApiSlice, useGetMoviesQuery } from "./paginatedTableApi";

const columnHelper = createColumnHelper<Movie>();

const MovieTableView = () => {
  // Inject API slice for lazy loading
  useInjectApiSlice(moviesApiSlice);

  const { t } = useTranslation();

  const columns = [
    columnHelper.accessor(row => row.title, {
      id: "title",
      cell: info => info.getValue(),
      header: () => <span>{t("movies_title")}</span>,
      meta: { type: "string" }, //meta is custom data, if you want to expand this you can in the ex.ts file and add your custom properties.
      //enableColumnFilter: false, //Specify false if you don't want the filter
      enableColumnFilter: false,
    }),
    columnHelper.accessor(row => row.director, {
      id: "director",
      cell: info => info.getValue(),
      header: () => <span>{t("movies_director")}</span>,
      meta: { type: "string" },
    }),
    columnHelper.accessor(row => row.genre, {
      id: "genre",
      cell: info => info.getValue(),
      header: () => <span>{t("movies_genre")}</span>,
      meta: { type: "string" },
    }),
    columnHelper.accessor(row => row.actors, {
      id: "actors",
      cell: info => info.getValue(),
      header: () => <span>{t("movies_actors")}</span>,
      meta: { type: "string" },
    }),
    columnHelper.accessor(row => row.plot, {
      id: "plot",
      cell: info => info.getValue(),
      header: () => <span>{t("movies_plot")}</span>,
      meta: { type: "string" },
    }),
    columnHelper.accessor(row => row.rating, {
      id: "rating",
      cell: info => "🍿".repeat(info.getValue()),
      header: () => <span>{t("movies_rating")}</span>,
      meta: { type: "number" },
    }),
    columnHelper.accessor(row => row.releaseDate, {
      id: "releaseDate",
      cell: info => info.getValue(),
      header: () => <span>{t("movies_release")}</span>,
      meta: { type: "date" },
    }),
  ] as ColumnDef<Movie>[];
  const [filters, setFilters] = useState<Partial<Movie>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const filterDefinitions: FilterDefinition<Movie>[] = [
    {
      id: "title",
      propName: "title",
      label: "Title",
      type: "text",
      placeholder: "Search by Title...",
    },
  ];

  return (
    <Box>
      <Heading>{t("movies_movies")}</Heading>
      {/*
          External filters rendering is done here by this AppFilters component that is a demo. it uses a drawer to show filters. 
          Feel free to implement your own mantaining and extending the Typing in the Filters.ts from BaseFilter<T> 
      */}
      <Flex my="0.5" alignItems={"flex-start"} justifyItems={"center"}>
        <Button size="sm" onClick={toggleSidebar}>
          Show Filters <LuFilter style={{ marginLeft: "8px" }} />
        </Button>
        <Box mt="4">
          <AppFilters<Movie>
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
            filters={filters}
            filterDefinitions={filterDefinitions}
            onFiltersChange={setFilters}
          />
        </Box>
      </Flex>

      {/*External filters example end*/}

      <AppArkApiTable<Movie>
        columns={columns}
        useQueryHook={useGetMoviesQuery}
        isDraggable
        externalFilters
        externalFiltersState={toColumnFiltersState(filters)}
        tableKey="Movies"
        reduxDispatchHook={useAppDispatch()}
      />
    </Box>
  );
};

export default MovieTableView;
