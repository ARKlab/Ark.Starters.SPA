import { ReactNode } from "react";
import { IconType } from "react-icons";
import { Action, AnyAction, Dispatch } from "redux";

export interface SubsectionMenuItemType {
  isInMenu: boolean;
  label: string;
  authenticatedOnly: boolean;
  isExternal: boolean;
  icon?: IconType;
  component?: () => ReactNode;
  externalUrl?: string;
  subsections?: SubsectionMenuItemType[];
  path?: string;
  isEntryPoint?: boolean;
}
export interface MainSectionType {
  subsections: SubsectionMenuItemType[];
  label: string;
  path: string;
  authenticatedOnly: boolean;
}
