import { MainSectionType } from "../components/sideBar/menuItem/types";
import { FaCloudUploadAlt, FaPlay, FaTable } from "react-icons/fa";

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
    ],
  },
];
