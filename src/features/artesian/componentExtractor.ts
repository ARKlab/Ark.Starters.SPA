import * as R from "ramda";

import type { Component, UserTypeConfig, MenuItem, ChildLink } from "./artesianTypes";

export const flatComponentList = (config: UserTypeConfig | string): string[] => {
  const parsedConfig = typeof config === "string" ? JSON.parse(config) : config;

  const menuItems = R.prop("menuItem", parsedConfig) ?? [];
  const childLinks = R.chain(R.pathOr([], ["childItem", "childLinks"]), menuItems);
  const components = R.chain(R.prop("components"), childLinks);
  const componentTypes = components.map(comp => (comp as { componentType?: string }).componentType).filter(Boolean);
  const sortedTypes = [...componentTypes].sort();

  return sortedTypes.filter((type): type is string => typeof type === "string");
};

export const extractComponentTypes = (config: UserTypeConfig | string): string[] => {
  try {
    return flatComponentList(config);
  } catch (error) {
    console.warn("Error extracting component types:", error);
    return [];
  }
};

export const extractComponents = (config: UserTypeConfig | string): Component[] => {
  try {
    const parsedConfig = typeof config === "string" ? JSON.parse(config) : config;
    const menuItems = parsedConfig.menuItem ?? [];

    if (!Array.isArray(menuItems)) {
      return [];
    }

    const components: Component[] = [];

    menuItems.forEach((menuItem: MenuItem) => {
      const childLinks = menuItem.childItem?.childLinks ?? [];

      if (Array.isArray(childLinks)) {
        childLinks.forEach((childLink: ChildLink) => {
          const linkComponents = childLink.components;

          if (Array.isArray(linkComponents)) {
            linkComponents.forEach((component: Component) => {
              if (component.componentType) {
                components.push({
                  componentType: component.componentType,
                });
              }
            });
          }
        });
      }
    });

    return components;
  } catch (error) {
    console.warn("Error extracting components:", error);
    return [];
  }
};

export const flattenComponentTypes = (obj: unknown): string[] => {
  const types: string[] = [];

  const traverse = (value: unknown): void => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach(traverse);
    } else if (typeof value === "object") {
      const record = value as Record<string, unknown>;

      Object.entries(record).forEach(([key, val]) => {
        if (key === "componentType" && typeof val === "string") {
          types.push(val);
        }
        traverse(val);
      });
    }
  };

  traverse(obj);

  return [...new Set(types)].sort();
};
