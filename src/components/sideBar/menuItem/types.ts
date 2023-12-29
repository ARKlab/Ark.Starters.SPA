import { ReactNode } from "react";
import { IconType } from "react-icons";
import { Action, AnyAction, Dispatch } from "redux";

interface SectionItem {
  path: string;
  label: string;
}

export interface SubsectionMenuItemType extends SectionItem {
  component?: (props: { a: Dispatch }) => ReactNode;
  isInMenu: boolean;
  icon?: IconType;
  isExternal: boolean;
  hasSubsections?: boolean;
  subsections?: SubsectionMenuItemType[];
}
export interface MainSectionType extends SectionItem {
  defaultSubMenuPath: string;
  subsections: SubsectionMenuItemType[];
}
