import { MainSectionType } from "../components/sideBar/menuItem/types";
import {
  FaCloudUploadAlt,
  FaExternalLinkAlt,
  FaGamepad,
  FaKey,
  FaHatWizard,
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
import WizardFormView from "../features/formWizard/formWizard";

/*This is the Main Section ARRAY populate this to populate the main nav menu
It is also used to create all the Routes for the router*/
export const mainSections: MainSectionType[] = [
  {
    label: "Main Test Section",
    path: "/main",
    authenticatedOnly: true,
    subsections: [
      {
        path: "/jsonplaceholder",
        label: "Posts",
        icon: FaCloudUploadAlt,
        isInMenu: true,
        isExternal: false,
        component: JsonPlaceHolderView,
        authenticatedOnly: true,
      },
      {
        path: "/playground",
        label: "PlayGround",
        icon: FaPlay,
        isInMenu: true,
        isExternal: false,
        component: PlaygroundView,
        authenticatedOnly: false,
      },
      {
        path: "/configTable",
        label: "Config Table",
        icon: FaTable,
        isInMenu: true,
        isExternal: false,
        component: ConfigTableExampleView,
        authenticatedOnly: true,
      },
      {
        path: "/moviesTable",
        label: "Movie Paginated Table",
        icon: RiMovie2Line,
        isInMenu: true,
        isExternal: false,
        component: MovieTableView,
        authenticatedOnly: true,
      },
      {
        path: "/videoGamesTable",
        label: "VideoGames Table",
        icon: FaGamepad,
        isInMenu: true,
        isExternal: false,
        component: VideoGamesTableView,
        authenticatedOnly: true,
      },

      {
        path: "/wizardForm",
        label: "Wizard Form",
        icon: FaTable,
        isInMenu: true,
        isExternal: false,
        component: WizardFormView,
        authenticatedOnly: true,
      },
    ],
  },
  {
    label: "External Section",
    path: "/ext",
    authenticatedOnly: false,
    subsections: [
      {
        externalUrl: "https://www.google.com",
        label: "Google",
        icon: FaExternalLinkAlt,
        isInMenu: true,
        isExternal: true,
        authenticatedOnly: false,
      },
      {
        externalUrl: "https://react.dev/",
        label: "React",
        icon: FaExternalLinkAlt,
        isInMenu: true,
        isExternal: true,
        authenticatedOnly: false,
      },
    ],
  },
  {
    label: "Another Section",
    path: "/anotherSection",
    authenticatedOnly: true,
    subsections: [
      {
        label: "Sub Subsections",
        path: "/nested",
        isInMenu: true,
        isExternal: false,
        authenticatedOnly: false,
        subsections: [
          {
            path: "/staticPage",
            label: "Static Page",
            component: StaticPage,
            icon: FaTable,
            isInMenu: true,
            isExternal: false,
            authenticatedOnly: true,
          },
          {
            externalUrl: "https://www.google.com",
            label: "Google",
            icon: FaExternalLinkAlt,
            isInMenu: true,
            isExternal: true,
            authenticatedOnly: false,
          },
          {
            externalUrl: "https://react.dev/",
            label: "React",
            icon: FaExternalLinkAlt,
            isInMenu: true,
            isExternal: true,
            authenticatedOnly: false,
          },
        ],
      },
    ],
  },
];
