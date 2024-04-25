import { Heading } from '@chakra-ui/react'
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
import { Navigate } from "react-router-dom";

import { Bomb } from "../components/Bomb";
import LazyLoad from "../components/lazyLoad";
import type { MainSectionType } from "../components/sideBar/menuItem/types";
import NoEntryPoint from "../features/staticPageExample/staticPage";


/*This is the Main Section ARRAY populate this to populate the main nav menu
It is also used to create all the Routes for the router*/
export const mainSections: MainSectionType[] = [
  {
    label: 'Main Test Section',
    path: '',
    subsections: [
      {
        path: '',
        label: 'index',
        isInMenu: false,
        component: <Navigate to="jsonplaceholder" />,
        isEntryPoint: true,
      },
      {
        path: 'jsonplaceholder',
        label: 'Posts',
        icon: FaCloudUploadAlt,
        isInMenu: true,
        component: (
          <LazyLoad
            loader={async () => import("../features/fetchApiExample/JsonPlaceHolder")}
          />
        ),
        isEntryPoint: true,
      },
      {
        path: 'playground',
        label: 'PlayGround',
        icon: FaPlay,
        isInMenu: true,
        component: (
          <LazyLoad
            loader={async () => import("../features/playground/playgroundView")}
          />
        ),
      },
      {
        path: 'configTable',
        label: 'Config Table',
        icon: FaTable,
        isInMenu: true,
        component: (
          <LazyLoad
            loader={async () => import("../features/configTable/configTableExample")}
          />
        ),
      },
      {
        path: 'moviesTable',
        label: 'Movie Paginated Table',
        icon: RiMovie2Line,
        isInMenu: true,
        component: (
          <LazyLoad
            loader={async () => import("../features/paginatedTable/moviePage")}
          />
        ),
      },
      {
        path: 'videoGamesTable',
        label: 'VideoGames Table',
        icon: FaGamepad,
        isInMenu: true,
        component: (
          <LazyLoad
            loader={async () => import("../features/formExample/videoGamesPage")}
          />
        ),
      },

      {
        path: 'wizardForm',
        label: 'Wizard Form',
        icon: FaTable,
        isInMenu: true,
        component: (
          <LazyLoad
            loader={async () => import("../features/formWizard/formWizard")}
          />
        ),
      },
      {
        path: 'translation',
        label: 'Translation Sample',
        icon: FaFlag,
        isInMenu: true,
        component: (
          <LazyLoad
            loader={async () => import("../features/localization/localizationPage")}
          />
        ),
      },
      {
        path: 'authonly',
        label: 'Auth Only',
        icon: FaLock,
        isInMenu: true,
        authenticatedOnly: true,
        component: <Heading as="h1">Auth Only</Heading>,
      },
      {
        path: 'bomb',
        label: 'Throw Error',
        icon: FaBomb,
        isInMenu: true,
        component: <Bomb />,
      },
    ],
  },
  {
    label: 'External Section',
    path: 'ext',
    subsections: [
      {
        externalUrl: 'https://www.google.com',
        label: 'Google',
        icon: FaExternalLinkAlt,
        isInMenu: true,
        authenticatedOnly: false,
      },
      {
        externalUrl: 'https://react.dev/',
        label: 'React',
        icon: FaExternalLinkAlt,
        isInMenu: true,
        authenticatedOnly: false,
      },
    ],
  },
  {
    label: 'Another Section',
    path: 'anotherSection',
    subsections: [
      {
        label: 'Sub Subsections',
        path: 'nested',
        isInMenu: true,
        authenticatedOnly: false,
        subsections: [
          {
            path: 'authonly',
            label: 'Auth Only',
            component: <NoEntryPoint />,
            icon: FaTable,
            isInMenu: true,
            authenticatedOnly: true,
          },
          {
            externalUrl: 'https://www.google.com',
            label: 'Google',
            icon: FaExternalLinkAlt,
            isInMenu: true,
            authenticatedOnly: false,
          },
          {
            externalUrl: 'https://react.dev/',
            label: 'React',
            icon: FaExternalLinkAlt,
            isInMenu: true,
            authenticatedOnly: false,
          },
        ],
      },
    ],
  },
]

export function getEntryPointPath(sections: MainSectionType[]): string {
  for (const section of sections) {
    for (const subsection of section.subsections ?? []) {
      if (subsection.path === '/') {
        return '/'
      }
      if (subsection.isEntryPoint) {
        return (section.path ?? '' + subsection.path) || '/'
      }
    }
  }
  return '/'
}
