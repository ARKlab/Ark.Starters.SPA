import {
  LuBomb,
  LuCloudUpload,
  LuExternalLink,
  LuFlag,
  LuGamepad2,
  LuLock,
  LuPlay,
  LuTable,
 LuFilm, LuFlaskConical , LuListTree } from "react-icons/lu";
import { Navigate } from "react-router";

import type { ArkRoute } from "../lib/siteMapTypes";

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
        icon: LuCloudUpload,
        isInMenu: true,
        lazy: async () => import("../features/fetchApiExample/JsonPlaceHolder"),
      },
      {
        path: "playground",
        label: "PlayGround",
        icon: LuPlay,
        isInMenu: true,
        lazy: async () => import("../features/notificationPlayground/notificationPlaygroundView"),
      },
      {
        path: "globalLoadingBar",
        label: "GlobalLoadingBar",
        icon: LuPlay,
        isInMenu: true,
        lazy: async () => import("../features/globalLoadingBar/globalLoadingBarPage"),
      },
      {
        path: "rtkqErrorHandling",
        label: "rtkqErrorHandling",
        icon: LuPlay,
        isInMenu: true,
        lazy: async () => import("../features/rtkqErrorHandling/rtkqErrorHandlingPage"),
      },
      {
        path: "permissionsPlayground",
        label: "Permissions",
        authenticatedOnly: true,
        icon: LuLock,
        isInMenu: true,
        lazy: async () => import("../features/permissionsPlayground/permissionsPlaygroundView"),
      },
      {
        path: "protectedRoute",
        label: "Protected Route",
        authenticatedOnly: true,
        permissions: ["grant:admin"],
        icon: LuLock,
        isInMenu: false,
        lazy: async () => import("../features/permissionsPlayground/protectedRouteView"),
      },

      {
        path: "configTable",
        label: "Config Table",
        icon: LuTable,
        isInMenu: true,
        lazy: async () => import("../features/configTable/configTableExample"),
      },
      {
        path: "moviesTable",
        label: "Movie Paginated Table",
        icon: LuFilm,
        isInMenu: true,
        lazy: async () => import("../features/paginatedTable/moviePage"),
      },
      {
        path: "videoGamesTable",
        label: "VideoGames Table",
        icon: LuGamepad2,
        isInMenu: true,
        lazy: async () => import("../features/formExample/videoGamesPage"),
      },
      {
        path: "controlComponents",
        label: "Control Components",
        icon: LuTable,
        isInMenu: true,
        lazy: async () => import("../features/controlComponentsDemo/controlComponents"),
      },

      {
        path: "wizardForm",
        label: "Wizard Form",
        icon: LuTable,
        isInMenu: true,
        lazy: async () => import("../features/formWizard/formWizard"),
      },
      {
        path: "translation",
        label: "Translation Sample",
        icon: LuFlag,
        isInMenu: true,
        lazy: async () => import("../features/localization/localizationPage"),
      },

      {
        path: "authonly",
        label: "Auth Only",
        icon: LuLock,
        isInMenu: true,
        authenticatedOnly: true,
        lazy: async () => import("../features/authentication/authInfoPage"),
      },
      {
        path: "bomb",
        label: "Throw Error",
        icon: LuBomb,
        isInMenu: true,
        lazy: async () => import("../components/Bomb"),
      },
      {
        path: "componentsTestPage",
        label: "Components Test Page",
        icon: LuFlaskConical,
        isInMenu: true,
        lazy: async () => import("../features/tests/ComponentsPage"),
      },
      //This is the way we must define the routes for pages that have details pages
      {
        path: "details",
        label: "Details Page",
        icon: LuListTree,
        isInMenu: true,
        subsections: [
          {
            path: "",
            label: "",
            isInMenu: false,
            lazy: async () => import("../features/detailsPage/detailsPageExampleMainView"),
          },
          {
            path: ":id",
            label: "Details",
            isInMenu: false,
            lazy: async () => import("../features/detailsPage/detailsPage"),
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
        icon: LuExternalLink,
        isInMenu: true,
        authenticatedOnly: false,
      },
      {
        externalUrl: "https://react.dev/",
        label: "React",
        icon: LuExternalLink,
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
            lazy: async () => import("../features/staticPageExample/staticPage"),
            icon: LuTable,
            isInMenu: true,
            authenticatedOnly: true,
          },
          {
            externalUrl: "https://www.google.com",
            label: "Google",
            icon: LuExternalLink,
            isInMenu: true,
            authenticatedOnly: false,
          },
          {
            externalUrl: "https://react.dev/",
            label: "React",
            icon: LuExternalLink,
            isInMenu: true,
            authenticatedOnly: false,
          },
        ],
      },
    ],
  },
];
