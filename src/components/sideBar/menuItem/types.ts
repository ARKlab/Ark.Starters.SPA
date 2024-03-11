import { ReactNode } from "react";
import { IconType } from "react-icons";
import { Action, AnyAction, Dispatch } from "redux";

export interface SubsectionMenuItemType {
  component?: () => ReactNode;
  isInMenu: boolean;
  icon?: IconType;
  isExternal: boolean;
  externalUrl?: string;
  hasSubsections?: boolean;
  subsections?: SubsectionMenuItemType[];
  path?: string;
  label: string;
}
export interface MainSectionType {
  subsections: SubsectionMenuItemType[];
  label: string;
}
