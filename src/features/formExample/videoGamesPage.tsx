import { Box, Heading } from "@chakra-ui/react";

import {
  ColumnDef,
  ColumnFiltersState,
  createColumnHelper,
} from "@tanstack/react-table";

import { useState } from "react";
import { PaginatedSortableTable } from "../../componentsCommon/PaginatedSortableTable/PaginatedSortableTable";
import { useGetVideoGamesQuery } from "./videoGamesApiSlice";
import { VideoGame } from "./videoGamesSampleDataAndTypes";
import VideoGamesForm from "./videoGamesForm";

const columnHelper = createColumnHelper<VideoGame>();

const columns = [
  columnHelper.accessor((row) => row.title, {
    id: "title",
    cell: (info) => info.getValue(),
    header: () => <span>Title</span>,
    meta: { type: "string" },
    enableColumnFilter: false,
  }),
  columnHelper.accessor((row) => row.releaseYear, {
    id: "releaseYear",
    cell: (info) => info.getValue(),
    header: () => <span>Release Year</span>,
    meta: { type: "number" },
    enableColumnFilter: false,
  }),
  columnHelper.accessor((row) => row.developer, {
    id: "developer",
    cell: (info) => info.getValue(),
    header: () => <span>Developer</span>,
    meta: { type: "string" },
    enableColumnFilter: false,
  }),
  columnHelper.accessor((row) => row.rating, {
    id: "rating",
    cell: (info) => "🎮 " + info.getValue(),
    header: () => <span>Rating</span>,
    meta: { type: "number" },
    enableColumnFilter: false,
  }),
  columnHelper.accessor((row) => row.platform, {
    id: "platform",
    cell: (info) => info.getValue(),
    header: () => <span>Platform</span>,
    meta: { type: "string" },
    enableColumnFilter: false,
  }),
  columnHelper.accessor((row) => row.salesMillions, {
    id: "salesMillions",
    cell: (info) => info.getValue(),
    header: () => <span>Sales (Millions)</span>,
    meta: { type: "number" },
    enableColumnFilter: false,
  }),
  columnHelper.accessor((row) => row.genre, {
    id: "genre",
    cell: (info) => info.getValue(),
    header: () => <span>Genre</span>,
    meta: { type: "number" },
    enableColumnFilter: false,
  }),
] as ColumnDef<VideoGame>[];

const VideoGamesTableView = () => {
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
    <Box my="70px">
      <Heading>Video Games</Heading>
      <VideoGamesForm />
      <PaginatedSortableTable<VideoGame>
        columns={columns}
        useQueryHook={useGetVideoGamesQuery}
        isDraggable={false}
        isSortable={false}
      />
    </Box>
  );
};

export default VideoGamesTableView;
