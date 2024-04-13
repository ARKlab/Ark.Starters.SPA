import {
  FaBomb,
  FaCloudUploadAlt,
  FaExternalLinkAlt,
  FaGamepad,
  FaPlay,
  FaTable,
} from "react-icons/fa";
import { RiMovie2Line } from "react-icons/ri";
import { MainSectionType } from "../components/sideBar/menuItem/types";
import NoEntryPoint from "../features/NoEntryPoint/staticPage";
import LazyLoad from "../componentsCommon/lazyLoad";
import { Bomb } from "../componentsCommon/Bomb";

/*This is the Main Section ARRAY populate this to populate the main nav menu
It is also used to create all the Routes for the router*/
export const mainSections: MainSectionType[] = [
  {
    label: "Main Test Section",
    path: "main",
    subsections: [
      {
        path: "jsonplaceholder",
        label: "Posts",
        icon: FaCloudUploadAlt,
        isInMenu: true,
        component: <LazyLoad loader={() => import("../features/jsonPlaceholderAPI/JsonPlaceHolder")} />,
        authenticatedOnly: true,
        isEntryPoint: true,
      },
      {
        path: "playground",
        label: "PlayGround",
        icon: FaPlay,
        isInMenu: true,
        component: <LazyLoad loader={() => import("../features/playground/playgroundView")} />,
        authenticatedOnly: false,
      },
      {
        path: "configTable",
        label: "Config Table",
        icon: FaTable,
        isInMenu: true,
        component: <LazyLoad loader={() => import("../features/configTable/configTableExample")} />,
        authenticatedOnly: true,
      },
      {
        path: "moviesTable",
        label: "Movie Paginated Table",
        icon: RiMovie2Line,
        isInMenu: true,
        component: <LazyLoad loader={() => import("../features/paginatedTable/moviePage")} />,
        authenticatedOnly: true,
      },
      {
        path: "videoGamesTable",
        label: "VideoGames Table",
        icon: FaGamepad,
        isInMenu: true,
        component: <LazyLoad loader={() => import("../features/formExample/videoGamesPage")} />,
        authenticatedOnly: true,
      },

      {
        path: "wizardForm",
        label: "Wizard Form",
        icon: FaTable,
        isInMenu: true,
        component: <LazyLoad loader={() => import("../features/formWizard/formWizard")} />,
        authenticatedOnly: true,
      },
      {
        path: "bomb",
        label: "Throw Error",
        icon: FaBomb,
        isInMenu: true,
        component: <Bomb />
      }
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
            path: "staticPage",
            label: "Static Page",
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
