import { CiLock } from "react-icons/ci";
import {
  FaBomb,
  FaCloudUploadAlt,
  FaExternalLinkAlt,
  FaFlag,
  FaGamepad,
  FaLock,
  FaPlay,
  FaTable,
} from "react-icons/fa";
import { RiMovie2Line } from "react-icons/ri";
import { TbListDetails } from "react-icons/tb";
import { Navigate } from "react-router";

import { Bomb } from "../components/Bomb";
import DetailsPage from "../features/detailsPage/detailsPage";
import DetailsPageExampleMainView from "../features/detailsPage/detailsPageExampleMainView";
import NoEntryPoint from "../features/staticPageExample/staticPage";
import ComponentsTestPage from "../features/tests/ComponentsPage";

import type { ArkRoute } from "./types";

/*This is the Main Section ARRAY populate this to populate the main nav menu
It is also used to create all the Routes for the router*/
export const siteMap: ArkRoute[] = [
  {
    label: "Main Test Section",
    path: "",
    subsections: [
      {
        path: "",
        label: "index",
        isInMenu: false,
        component: <Navigate to="jsonplaceholder" />,
      },
      {
        path: "jsonplaceholder",
        label: "Posts",
        icon: FaCloudUploadAlt,
        isInMenu: true,
        lazy: async () => import("../features/fetchApiExample/JsonPlaceHolder"),
      },
      {
        path: "playground",
        label: "PlayGround",
        icon: FaPlay,
        isInMenu: true,
        lazy: async () => import("../features/notificationPlayground/notificationPlaygroundView"),
      },
      {
        path: "globalLoadingBar",
        label: "GlobalLoadingBar",
        icon: FaPlay,
        isInMenu: true,
        lazy: async () => import("../features/globalLoadingBar/globalLoadingBarPage"),
      },
      {
        path: "rtkqErrorHandling",
        label: "rtkqErrorHandling",
        icon: FaPlay,
        isInMenu: true,
        lazy: async () => import("../features/rtkqErrorHandling/rtkqErrorHandlingPage"),
      },
      {
        path: "permissionsPlayground",
        label: "Permissions",
        authenticatedOnly: true,
        icon: CiLock,
        isInMenu: true,
        lazy: async () => import("../features/permissionsPlayground/permissionsPlaygroundView"),
      },
      {
        path: "protectedRoute",
        label: "Protected Route",
        authenticatedOnly: true,
        permissions: ["grant:admin"],
        icon: CiLock,
        isInMenu: false,
        lazy: async () => import("../features/permissionsPlayground/protectedRouteView"),
      },

      {
        path: "configTable",
        label: "Config Table",
        icon: FaTable,
        isInMenu: true,
        lazy: async () => import("../features/configTable/configTableExample"),
      },
      {
        path: "moviesTable",
        label: "Movie Paginated Table",
        icon: RiMovie2Line,
        isInMenu: true,
        lazy: async () => import("../features/paginatedTable/moviePage"),
      },
      {
        path: "videoGamesTable",
        label: "VideoGames Table",
        icon: FaGamepad,
        isInMenu: true,
        lazy: async () => import("../features/formExample/videoGamesPage"),
      },
      {
        path: "controlComponents",
        label: "Control Components",
        icon: FaTable,
        isInMenu: true,
        lazy: async () => import("../features/controlComponentsDemo/controlComponents"),
      },

      {
        path: "wizardForm",
        label: "Wizard Form",
        icon: FaTable,
        isInMenu: true,
        lazy: async () => import("../features/formWizard/formWizard"),
      },
      {
        path: "translation",
        label: "Translation Sample",
        icon: FaFlag,
        isInMenu: true,
        lazy: async () => import("../features/localization/localizationPage"),
      },

      {
        path: "authonly",
        label: "Auth Only",
        icon: FaLock,
        isInMenu: true,
        authenticatedOnly: true,
        lazy: async () => import("../features/authentication/authInfoPage"),
      },
      {
        path: "bomb",
        label: "Throw Error",
        icon: FaBomb,
        isInMenu: true,
        component: <Bomb />,
      },
      {
        path: "componentsTestPage",
        label: "Components Test Page",
        icon: FaBomb,
        isInMenu: false,
        component: <ComponentsTestPage />,
      },
      //This is the way we must define the routes for pages that have details pages
      {
        path: "details",
        label: "Details Page",
        icon: TbListDetails,
        isInMenu: true,
        subsections: [
          {
            path: "",
            label: "",
            isInMenu: false,
            component: <DetailsPageExampleMainView />,
          },
          {
            path: ":id",
            label: "Details",
            isInMenu: false,
            component: <DetailsPage />,
          },
        ],
      },
    ],
  },
  {
    label: "External Section",
    path: "ext",
    subsections: [
      {
        externalUrl: "https://www.google.com",
        label: "Google",
        icon: FaExternalLinkAlt,
        isInMenu: true,
        authenticatedOnly: false,
      },
      {
        externalUrl: "https://react.dev/",
        label: "React",
        icon: FaExternalLinkAlt,
        isInMenu: true,
        authenticatedOnly: false,
      },
    ],
  },
  {
    label: "Another Section",
    path: "anotherSection",
    subsections: [
      {
        label: "Sub Subsections",
        path: "nested",
        isInMenu: true,
        authenticatedOnly: false,
        subsections: [
          {
            path: "authonly",
            label: "Auth Only",
            component: <NoEntryPoint />,
            icon: FaTable,
            isInMenu: true,
            authenticatedOnly: true,
          },
          {
            externalUrl: "https://www.google.com",
            label: "Google",
            icon: FaExternalLinkAlt,
            isInMenu: true,
            authenticatedOnly: false,
          },
          {
            externalUrl: "https://react.dev/",
            label: "React",
            icon: FaExternalLinkAlt,
            isInMenu: true,
            authenticatedOnly: false,
          },
        ],
      },
    ],
  },
];
