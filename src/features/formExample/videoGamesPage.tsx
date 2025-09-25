import { Box, Heading } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { PaginatedSortableTable } from "../../components/PaginatedSortableTable/PaginatedSortableTable";

import {
  useGetVideoGamesGenresQuery,
  useGetVideoGamesQuery,
} from "./videoGamesApiSlice";
import VideoGamesForm from "./videoGamesForm";
import type { VideoGame } from "./videoGamesSampleDataAndTypes";

const columnHelper = createColumnHelper<VideoGame>()

const VideoGamesTableView = () => {
  const { data: genres } = useGetVideoGamesGenresQuery();
  const { t } = useTranslation();
  const columns = [
    columnHelper.accessor((row) => row.title, {
      id: 'title',
      cell: (info) => info.getValue(),
      header: () => <span>{t("games_title")}</span>,
      meta: { type: "string" },
      enableColumnFilter: false,
    }),
    columnHelper.accessor((row) => row.releaseYear, {
      id: 'releaseYear',
      cell: (info) => info.getValue(),
      header: () => <span>{t("games_release_year")}</span>,
      meta: { type: "number" },
      enableColumnFilter: false,
    }),
    columnHelper.accessor((row) => row.developer, {
      id: 'developer',
      cell: (info) => info.getValue(),
      header: () => <span>{t("games_developer")}</span>,
      meta: { type: "string" },
      enableColumnFilter: false,
    }),
    columnHelper.accessor((row) => row.rating, {
      id: "rating",
      cell: (info) => "🎮 " + info.getValue(),
      header: () => <span>{t("games_rating")}</span>,
      meta: { type: "number" },
      enableColumnFilter: false,
    }),
    columnHelper.accessor((row) => row.platform, {
      id: 'platform',
      cell: (info) => info.getValue(),
      header: () => <span>{t("games_platform")}</span>,
      meta: { type: "string" },
      enableColumnFilter: false,
    }),
    columnHelper.accessor((row) => row.salesMillions, {
      id: 'salesMillions',
      cell: (info) => info.getValue(),
      header: () => <span>{t("games_sales_millions")}</span>,
      meta: { type: "number" },
      enableColumnFilter: false,
    }),
    columnHelper.accessor((row) => row.genre, {
      id: 'genre',
      cell: (info) => {
        const genreId = info.getValue();
        const matchingGenre = genres?.find((x) => x.id === genreId);
         
        return matchingGenre?.name ?? t("games_unknown_genre");
      },
      header: () => <span>{t("games_genre")}</span>,
      meta: { type: "number" },
      enableColumnFilter: false,
    }),
  ] as ColumnDef<VideoGame>[]

  return (
    <Box>
      <Heading>{t("games_video_games")}</Heading>
      <VideoGamesForm />
      <PaginatedSortableTable<VideoGame>
        columns={columns}
        useQueryHook={useGetVideoGamesQuery}
        isDraggable={false}
        isSortable={false}
      />
    </Box>
  )
}

export default VideoGamesTableView
