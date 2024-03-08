import { IconType } from "react-icons";
import { Dispatch } from "redux";

interface SectionItem {
  path?: string;
  label: string;
}

export interface SubsectionMenuItemType extends SectionItem {
  component?: () => JSX.Element;
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
