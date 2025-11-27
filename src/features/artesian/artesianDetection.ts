import type { UserTypeConfig } from "./artesianTypes";

type ConfigItem = {
  reportId?: string;
  childItem?: {
    childLinks?: {
      reportId?: string;
      components?: {
        reportId?: string;
      }[];
    }[];
  };
};

type ParsedConfig = {
  reportId?: string;
  menuItem?: ConfigItem[];
};

export const hasArtesianAccess = (config: UserTypeConfig | string | null | undefined): boolean => {
  if (!config) return false;

  try {
    const parsedConfig: ParsedConfig = typeof config === "string" ? JSON.parse(config) : config;

    // Check if the config has reportId set to "artesian"
    if (parsedConfig.reportId === "artesian") {
      return true;
    }

    // Also check nested structures for reportId
    if (parsedConfig.menuItem && Array.isArray(parsedConfig.menuItem)) {
      return parsedConfig.menuItem.some((item: ConfigItem) => {
        // Check at menu item level
        if (item.reportId === "artesian") return true;

        // Check in childItem/childLinks
        if (item.childItem?.childLinks && Array.isArray(item.childItem.childLinks)) {
          return item.childItem.childLinks.some(link => {
            if (link.reportId === "artesian") return true;

            // Check in components
            if (link.components && Array.isArray(link.components)) {
              return link.components.some(comp => comp.reportId === "artesian");
            }

            return false;
          });
        }

        return false;
      });
    }

    return false;
  } catch (error) {
    console.warn("Error checking Artesian access:", error);
    return false;
  }
};

export const isArtesianConfigured = (): boolean => {
  const hasApiKey = !!(import.meta.env.VITE_ARTESIAN_API_KEY ?? "testkey");
  const hasBaseUrl = !!(
    import.meta.env.VITE_ARTESIAN_BASE_URL ?? "https://k4view-artesian-useradmin-test.azurewebsites.net/api/"
  );
  const hasAuthCodes = !!(
    import.meta.env.VITE_ARTESIAN_CREATE_GROUP_CODE ??
    import.meta.env.VITE_ARTESIAN_UPDATE_GROUP_CODE ??
    import.meta.env.VITE_ARTESIAN_ACL_UPDATER_CODE
  );

  return hasBaseUrl && (hasApiKey || hasAuthCodes);
};

export const logArtesianStatus = (userTypeName: string, config: UserTypeConfig | string | null): void => {
  const hasAccess = hasArtesianAccess(config);
  const isConfigured = isArtesianConfigured();

  console.log(`[Artesian] User type "${userTypeName}":`, {
    hasArtesianAccess: hasAccess,
    isArtesianConfigured: isConfigured,
    willTriggerIntegration: hasAccess && isConfigured,
  });
};
