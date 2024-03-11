import { MainSectionType } from "../components/sideBar/menuItem/types";
import {
  FaCloudUploadAlt,
  FaExternalLinkAlt,
  FaGamepad,
  FaPlay,
  FaTable,
} from "react-icons/fa";
import { RiMovie2Line } from "react-icons/ri";
import JsonPlaceHolderView from "../features/jsonPlaceholderAPI/JsonPlaceHolder";
import PlaygroundView from "../features/playground/playgroundView";
import ConfigTableExampleView from "../features/configTable/configTableExample";
import MovieTableView from "../features/paginatedTable/moviePage";
import VideoGamesTableView from "../features/formExample/videoGamesPage";
import StaticPage from "../features/staticPage/staticPage";

/*This is the Main Section ARRAY populate this to populate the main nav menu
It is also used to create all the Routes for the router*/
export const mainSections: MainSectionType[] = [
  {
    label: "Main Test Section",

    subsections: [
      {
        path: "/jsonplaceholder",
        label: "Posts",
        icon: FaCloudUploadAlt,
        isInMenu: true,
        isExternal: false,
        component: JsonPlaceHolderView,
      },
      {
        path: "/playground",
        label: "PlayGround",
        icon: FaPlay,
        isInMenu: true,
        isExternal: false,
        component: PlaygroundView,
      },
      {
        path: "/configTable",
        label: "Config Table",
        icon: FaTable,
        isInMenu: true,
        isExternal: false,
        component: ConfigTableExampleView,
      },
      {
        path: "/moviesTable",
        label: "Movie Paginated Table",
        icon: RiMovie2Line,
        isInMenu: true,
        isExternal: false,
        component: MovieTableView,
      },
      {
        path: "/videoGamesTable",
        label: "VideoGames Table",
        icon: FaGamepad,
        isInMenu: true,
        isExternal: false,
        component: VideoGamesTableView,
      },
    ],
  },
  {
    label: "External Section",
    subsections: [
      {
        externalUrl: "https://www.google.com",
        label: "Google",
        icon: FaExternalLinkAlt,
        isInMenu: true,
        isExternal: true,
      },
      {
        externalUrl: "https://react.dev/",
        label: "React",
        icon: FaExternalLinkAlt,
        isInMenu: true,
        isExternal: true,
      },
    ],
  },
  {
    label: "Another Section",

    subsections: [
      {
        label: "Sub Subsections",
        hasSubsections: true,
        isInMenu: true,
        isExternal: false,
        subsections: [
          {
            path: "/staticPage",
            label: "Static Page",
            component: StaticPage,
            icon: FaTable,
            isInMenu: true,
            isExternal: false,
          },
          {
            externalUrl: "https://www.google.com",
            label: "Google",
            icon: FaExternalLinkAlt,
            isInMenu: true,
            isExternal: true,
          },
          {
            externalUrl: "https://react.dev/",
            label: "React",
            icon: FaExternalLinkAlt,
            isInMenu: true,
            isExternal: true,
          },
        ],
      },
    ],
  },
];
