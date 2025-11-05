import type { UserTypeConfig } from "./artesianTypes";

export const hasArtesianAccess = (config: UserTypeConfig | string | null | undefined): boolean => {
  if (!config) return false;

  try {
    const parsedConfig = typeof config === "string" ? JSON.parse(config) : config;

    // Check if the config has reportId set to "artesian"
    if (parsedConfig?.reportId === "artesian") {
      return true;
    }

    // Also check nested structures for reportId
    if (parsedConfig?.menuItem && Array.isArray(parsedConfig.menuItem)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      return parsedConfig.menuItem.some((item: any) => {
        // Check at menu item level
        if (item?.reportId === "artesian") return true;

        // Check in childItem/childLinks
        if (item?.childItem?.childLinks && Array.isArray(item.childItem.childLinks)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
          return item.childItem.childLinks.some((link: any) => {
            if (link?.reportId === "artesian") return true;

            // Check in components
            if (link?.components && Array.isArray(link.components)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
              return link.components.some((comp: any) => comp?.reportId === "artesian");
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
