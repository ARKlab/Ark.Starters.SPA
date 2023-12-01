import { MainSectionType } from "../components/sideBar/menuItem/types";
import {
  FaFileUpload,
  FaExternalLinkAlt,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { AiFillFolder, AiOutlineTable } from "react-icons/ai";

/*This is the Main Section ARRAY populate this to populate the main nav menu*/
export const mainSections: MainSectionType[] = [
  {
    path: "/main",
    label: "Main Test Section",
    defaultSubMenuPath: "/manualUpload",
    subsections: [
      {
        path: "/test",
        label: "Test",
        icon: FaCloudUploadAlt,
        isInMenu: true,
        isExternal: false,
      },
    ],
  },
];
