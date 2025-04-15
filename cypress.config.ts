import { defineConfig } from "cypress";
import type { InlineConfig } from "vite";
import { build, preview } from "vite";

// This is "cypress open" when developing tests and "cypress run" when just running tests, e.g. CI
const IS_INTERACTIVE = process.env.npm_lifecycle_script?.includes("cypress open");

export default defineConfig({
  env: {
    codeCoverage: {
      exclude: "cypress/**/*.*",
    },
  },
  e2e: {
    baseUrl: "http://localhost:3000",

    viewportHeight: 1000,
    viewportWidth: 1280,

    video: false,

    screenshotOnRunFailure: true,
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,

    defaultCommandTimeout: 15000,

    supportFile: "cypress/support/e2e.ts",

    specPattern: "**/*.e2e.{ts,tsx}",
    async setupNodeEvents(on, config) {
      if (!IS_INTERACTIVE) {
        console.log("Running in CI mode, use 'build' app");

        const vc = {
          mode: "e2e",
          build: {
            outDir: "cypress/dist",
          },
          preview: {
            port: 4321,
            strictPort: true,
            open: false,
          },
        } as InlineConfig;

        const watcher = await build(vc);
        const server = await preview(vc);
        console.log(`Vite preview server started at ${server.resolvedUrls?.local[0]}`);

        on("after:run", async () => {
          if ("close" in watcher) {
            await watcher.close();
          }

          await new Promise<void>((resolve, reject) => {
            server.httpServer.close(error => {
              if (error) reject(error);
              else resolve();
            });
          });
        });
      }

      //codeCoverageTask(on, config);

      /*
      on(
        "file:preprocessor",
        vitePreprocessor({
          mode: "development",
        }),
      );
      */

      return config;
    },
  },
});
