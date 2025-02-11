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
import { Navigate } from "react-router-dom";

import { Bomb } from "../components/Bomb";
import type { MainSectionType } from "../components/layout/sideBar/menuItem/types";
import LazyLoad from "../components/lazyLoad";
import DetailsPage from "../features/detailsPage/detailsPage";
import DetailsPageExampleMainView from "../features/detailsPage/detailsPageExampleMainView";
import NoEntryPoint from "../features/staticPageExample/staticPage";

/*This is the Main Section ARRAY populate this to populate the main nav menu
It is also used to create all the Routes for the router*/
export const mainSections: MainSectionType[] = [
  {
    label: "Main Test Section",
    path: "",
    subsections: [
      {
        path: "",
        label: "index",
        isInMenu: false,
        component: <Navigate to="jsonplaceholder" />,
        isEntryPoint: true,
      },
      {
        path: "jsonplaceholder",
        label: "Posts",
        icon: FaCloudUploadAlt,
        isInMenu: true,
        component: <LazyLoad loader={async () => import("../features/fetchApiExample/JsonPlaceHolder")} />,
        isEntryPoint: true,
      },
      {
        path: "playground",
        label: "PlayGround",
        icon: FaPlay,
        isInMenu: true,
        component: (
          <LazyLoad loader={async () => import("../features/notificationPlayground/notificationPlaygroundView")} />
        ),
      },
      {
        path: "globalLoadingBar",
        label: "GlobalLoadingBar",
        icon: FaPlay,
        isInMenu: true,
        component: (
          <LazyLoad loader={async () => import("../features/globalLoadingBar/globalLoadingPage")} />
        ),
      },
      {
        path: "permissionsPlayground",
        label: "Permissions",
        authenticatedOnly: true,
        icon: CiLock,
        isInMenu: true,
        component: (
          <LazyLoad loader={async () => import("../features/permissionsPlayground/permissionsPlaygroundView")} />
        ),
      },
      {
        path: "protectedRoute",
        label: "Protected Route",
        authenticatedOnly: true,
        permissions: ["grant:admin"],
        icon: CiLock,
        isInMenu: false,
        component: <LazyLoad loader={async () => import("../features/permissionsPlayground/protectedRouteView")} />,
      },

      {
        path: "configTable",
        label: "Config Table",
        icon: FaTable,
        isInMenu: true,
        component: <LazyLoad loader={async () => import("../features/configTable/configTableExample")} />,
      },
      {
        path: "moviesTable",
        label: "Movie Paginated Table",
        icon: RiMovie2Line,
        isInMenu: true,
        component: <LazyLoad loader={async () => import("../features/paginatedTable/moviePage")} />,
      },
      {
        path: "videoGamesTable",
        label: "VideoGames Table",
        icon: FaGamepad,
        isInMenu: true,
        component: <LazyLoad loader={async () => import("../features/formExample/videoGamesPage")} />,
      },

      {
        path: "wizardForm",
        label: "Wizard Form",
        icon: FaTable,
        isInMenu: true,
        component: <LazyLoad loader={async () => import("../features/formWizard/formWizard")} />,
      },
      {
        path: "translation",
        label: "Translation Sample",
        icon: FaFlag,
        isInMenu: true,
        component: <LazyLoad loader={async () => import("../features/localization/localizationPage")} />,
      },

      {
        path: "authonly",
        label: "Auth Only",
        icon: FaLock,
        isInMenu: true,
        authenticatedOnly: true,
        component: <LazyLoad loader={async () => import("../features/authentication/authInfoPage")} />,
      },
      {
        path: "bomb",
        label: "Throw Error",
        icon: FaBomb,
        isInMenu: true,
        component: <Bomb />,
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

mainSections.forEach(section => {
  console.log(`Section: ${section.label}, Path: ${section.path}`);
  section.subsections?.forEach(subsection => {
    console.log(`  Subsection: ${subsection.label}, Path: ${subsection.path}`);
  });
});

export function getEntryPointPath(sections: MainSectionType[]): string {
  for (const section of sections) {
    for (const subsection of section.subsections ?? []) {
      if (subsection.path === "/") {
        return "/";
      }
      if (subsection.isEntryPoint) {
        return (section.path ?? "" + subsection.path) || "/";
      }
    }
  }
  return "/";
}
