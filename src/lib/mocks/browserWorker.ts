import { http, type RequestHandler, passthrough } from "msw"
import { setupWorker } from "msw/browser"

const imports: Record<string, RequestHandler[]> = import.meta.glob("../../**/*.mocks.ts", {
  eager: true,
  import: "handlers",
})

let globalHandlers: RequestHandler[] = []
for (const x in imports) globalHandlers = globalHandlers.concat(imports[x])

export const worker = setupWorker(
  ...globalHandlers,
  http.all("/*", () => passthrough()),
)

// Make the `worker` and `http` references available globally,
// so they can be accessed in both runtime and test suites.
window.msw = {
  worker,
  http,
}
