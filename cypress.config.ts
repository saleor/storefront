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
    runMode: 0,
    openMode: 0,
  },
  env: {
    API_URL: process.env.SALEOR_API_URL,
    userEmail: process.env.CYPRESS_USER_EMAIL,
    userPassword: process.env.CYPRESS_USER_PASSWORD,
    digitalProduct: process.env.CYPRESS_DIGITAL_PRODUCT,
    productWithoutVariants: process.env.CYPRESS_WITHOUT_VARIANTS,
    productWithVariants: process.env.CYPRESS_WITH_VARIANTS,
    productToSearch: process.env.CYPRESS_PRODUCT_TO_SEARCH,
  },
  e2e: {
    baseUrl: "http://localhost:3000/",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
});
