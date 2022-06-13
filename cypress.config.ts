// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "o9u948",
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
  defaultCommandTimeout: 15000,
  requestTimeout: 15000,
  viewportWidth: 1400,
  viewportHeight: 660,
  e2e: {
    baseUrl: "http://localhost:3001/",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
});
