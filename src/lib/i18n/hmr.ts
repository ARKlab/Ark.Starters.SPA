import i18next from "i18next";

/**
 * Setup i18next HMR for development
 * Listens for custom HMR events from Vite and reloads specific namespaces
 */
export function setupI18nextHMR() {
  if (import.meta.hot) {
    import.meta.hot.on("i18next-hmr-reload", async (data: { lng: string; ns: string; path: string }) => {
      console.log(`[i18next-hmr] Reloading namespace: ${data.ns} for language: ${data.lng}`);
      
      try {
        // Reload the specific namespace bundle
        await i18next.reloadResources(data.lng, data.ns);
        
        // If this is the current language, emit languageChanged event to trigger re-renders
        if (i18next.language === data.lng) {
          i18next.emit("languageChanged", data.lng);
          console.log(`[i18next-hmr] Reloaded and triggered re-render for ${data.ns}`);
        } else {
          console.log(`[i18next-hmr] Reloaded ${data.ns} (not current language)`);
        }
      } catch (error) {
        console.error("[i18next-hmr] Failed to reload namespace:", error);
      }
    });
  }
}
