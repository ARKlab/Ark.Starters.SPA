import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

import LazyLoad from "./components/lazyLoad";
import { ColorModeProvider } from "./components/ui/color-mode";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme";

/**
 * ReactErrorBoundary at this level renders a Chakra-less/Redux-less context as they failed.
 * A nicer ReactErrorBoundary is used by the Application's Layout so this is really a last resort
 * for the user to take a screenshot and send to someone.
 * The only alternative would be an blank-page, which isn't nicer ...
 *
 * IMPORTANT: use only basic DOM/Style, UI Toolkit nor ReduxToolkit are available!
 */
function fallbackRender({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Fatal error. Reload the Browser (F5)</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <pre style={{ color: "red" }}>{error.stack}</pre>
    </div>
  );
}

window.addEventListener("vite:preloadError", () => {
  // reload the App if a dynamic import fails after App has been initialized
  // see https://www.vidbeo.com/blog/reload-nuxt-spa-on-missing-chunk-error/
  if (window.appReady)
    window.location.reload();
});

const rootElement = document.getElementById("root");
if (rootElement === null) throw new Error("#root not found");
const root = createRoot(rootElement);

// Initialize as little as possible so that we can Render the ErrorBoundary if initStatic throws any error
// Thus defer 'importing' initStatic via Lazy to avoid any throw in the 'global' scope
root.render(
  <StrictMode>
    <ReactErrorBoundary fallbackRender={fallbackRender}>
      <ChakraProvider value={theme}>
        <ColorModeProvider>
          <LazyLoad loader={async () => import("./initGlobals")} />
        </ColorModeProvider>
      </ChakraProvider>
    </ReactErrorBoundary>
  </StrictMode>,
);

reportWebVitals();
