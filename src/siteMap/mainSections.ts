import { MainSectionType } from "../components/sideBar/menuItem/types";
import { FaCloudUploadAlt, FaGamepad, FaPlay, FaTable } from "react-icons/fa";
import { RiMovie2Line } from "react-icons/ri";
import JsonPlaceHolderView from "../features/jsonPlaceholderAPI/JsonPlaceHolder";
import PlaygroundView from "../features/playground/playgroundView";
import ConfigTableExampleView from "../features/configTable/configTableExample";
import MovieTableView from "../features/paginatedTable/moviePage";
import VideoGamesTableView from "../features/formExample/videoGamesPage";
import StaticPage from "../features/staticPage/staticPage";
import WizardFormView from "../features/formWizard/formWizard";

/*This is the Main Section ARRAY populate this to populate the main nav menu*/
export const mainSections: MainSectionType[] = [
  {
    path: "/main",
    label: "Main Test Section",
    defaultSubMenuPath: "/manualUpload",
    subsections: [
      {
        path: "/jsonplaceholder",
        label: "Posts",
        icon: FaCloudUploadAlt,
        isInMenu: true,
        isExternal: false,
      },
      {
        path: "/playground",
        label: "PlayGround",
        icon: FaPlay,
        isInMenu: true,
        isExternal: false,
      },
      {
        path: "/configTable",
        label: "Config Table",
        icon: FaTable,
        isInMenu: true,
        isExternal: false,
      },
      {
        path: "/moviesTable",
        label: "Movie Paginated Table",
        icon: RiMovie2Line,
        isInMenu: true,
        isExternal: false,
      },
      {
        path: "/videoGamesTable",
        label: "VideoGames Table",
        icon: FaGamepad,
        isInMenu: true,
        isExternal: false,
        component: VideoGamesTableView,
      },
      {
        path: "/wizardForm",
        label: "Wizard Form",
        icon: FaTable,
        isInMenu: true,
        isExternal: false,
        component: WizardFormView,
      },
    ],
  },
  {
    label: "External Section",
    path: "/ext",
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
    path: "/anotherSection",
    subsections: [
      {
        label: "Sub Subsections",
        path: "/nested",
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
