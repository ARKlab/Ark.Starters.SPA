import { IconType } from "react-icons";
import { Action, AnyAction, Dispatch } from "redux";

interface SectionItem {
  path: string;
  label: string;
}

export interface SubsectionMenuItemType extends SectionItem {
  component?: (props: { a: Dispatch }) => any;
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
