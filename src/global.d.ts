import type { http } from "msw";
import { type SetupWorker } from "msw/browser";
import { type Router } from "react-router-dom";

declare global {
  interface Window {
    msw:
      | {
          worker: SetupWorker;
          http: typeof http;
        }
      | undefined;
    rtkq:
      | {
          resetCache: () => void;
        }
      | undefined;
    Cypress: object | undefined;
    router: Router;
    appReady: boolean;
  }
}
