import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",

    viewportHeight: 1000,
    viewportWidth: 1280,

    supportFile: "cypress/support/e2e.ts",

    specPattern: "src/**/*.cy.{ts,tsx}",
    setupNodeEvents(on, config) {
      require("@cypress/code-coverage/task")(on, config);
      return config;
    },
  },
});
