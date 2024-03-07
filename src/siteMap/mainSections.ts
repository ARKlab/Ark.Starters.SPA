import { MainSectionType } from "../components/sideBar/menuItem/types";
import { FaCloudUploadAlt, FaGamepad, FaPlay, FaTable } from "react-icons/fa";
import { RiMovie2Line } from "react-icons/ri";

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
      },
    ],
  },
];
