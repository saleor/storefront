/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "cypress";

require("dotenv").config();

export default defineConfig({
  projectId: "o9u948",
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
  defaultCommandTimeout: 15000,
  requestTimeout: 15000,
  viewportWidth: 1400,
  viewportHeight: 660,
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URI,
  },
  e2e: {
    baseUrl: "http://localhost:3001/",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
});
