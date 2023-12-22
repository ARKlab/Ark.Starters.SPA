import { MainSectionType } from "../components/sideBar/menuItem/types";
import { FaCloudUploadAlt } from "react-icons/fa";

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
