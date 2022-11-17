/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "cypress";
import "../react-storefront/packages/env-vars";

export default defineConfig({
  projectId: "o9u948",
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
  defaultCommandTimeout: 15000,
  requestTimeout: 15000,
  viewportWidth: 1400,
  viewportHeight: 660,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  env: {
    API_URL: "https://staging-demo.saleor.io/graphql/",
    userEmail: "admin@example.com",
    userPassword: "admin",
    digitalProduct: "cloud",
    productWithoutVariants: "beanie",
    productWithVariants: "zoom",
    productToSearch: "polo",
  },
  e2e: {
    baseUrl: "https://staging-demo.saleor.io/",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
});
