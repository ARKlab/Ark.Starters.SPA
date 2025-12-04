import { FaUsers } from "react-icons/fa";
import { Navigate } from "react-router";

import type { MainSectionType } from "../components/layout/sideBar/menuItem/types";

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
        component: <Navigate to="groupsManagement" />,
      },

      {
        path: "groupsManagement",
        label: "Groups Management",
        icon: FaUsers,
        isInMenu: true,
        lazy: async () => import("../features/groupsManagement/groupsManagementView"),
      },
      {
        path: "userManagement",
        label: "User Management",
        icon: FaUsers,
        isInMenu: true,
        lazy: async () => import("../features/userManagement/userManagementView"),
      },
    ],
  },
];
