import type { ReactNode } from "react";
import type { IconType } from "react-icons";

export type ArkRoute = {
  subsections?: ArkSubRoute[];
  label: string;
  path?: string;
  authenticatedOnly?: boolean;
  component?: ReactNode;
  lazy?: () => Promise<{ default: React.ComponentType<unknown> }>;
  permissions?: string[];
};

export type ArkSubRoute = {
  isInMenu: boolean;
  icon?: IconType;
  externalUrl?: string;
} & ArkRoute;
