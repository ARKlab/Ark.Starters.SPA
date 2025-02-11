import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

import LazyLoad from "./components/lazyLoad";
import reportWebVitals from "./reportWebVitals";

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
  window.location.reload();
});

const rootElement = document.getElementById("root");
if (rootElement === null) throw new Error("#root not found");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ReactErrorBoundary fallbackRender={fallbackRender}>
      <ChakraProvider value={defaultSystem}>
        <LazyLoad loader={async () => import("./initGlobals")} />
      </ChakraProvider>
    </ReactErrorBoundary>
  </StrictMode>,
);

reportWebVitals();
