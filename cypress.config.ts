import codeCoverageTask from "@cypress/code-coverage/task"
import { defineConfig } from "cypress"

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

    setupNodeEvents(on, config) {
      codeCoverageTask(on, config)

      /*
      on(
        "file:preprocessor",
        vitePreprocessor({
          mode: "development",
        }),
      );
      */

      return config
    },
  },
})
