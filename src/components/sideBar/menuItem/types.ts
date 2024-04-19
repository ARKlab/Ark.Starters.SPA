import type { ReactNode } from "react";
import type { IconType } from "react-icons";

export type MainSectionType = {
  subsections?: SubsectionMenuItemType[];
  label: string;
  path?: string;
  authenticatedOnly?: boolean;
  component?: ReactNode;
}

export type SubsectionMenuItemType = {
  isInMenu: boolean;
  icon?: IconType;
  externalUrl?: string;
  isEntryPoint?: boolean;
} & MainSectionType;
