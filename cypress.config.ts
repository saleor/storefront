/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
import cypress, { defineConfig } from "cypress";
import "../react-storefront/packages/env-vars";

export default defineConfig({
  projectId: "o9u948",
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
  defaultCommandTimeout: 15000,
  requestTimeout: 15000,
  viewportWidth: 1400,
  viewportHeight: 660,
  env: {
    API_URL: process.env.SALEOR_API_URL,
    userEmail: "test1@user.com",
    userPassword: "test1234",
    digitalProduct: "sea",
    productWithoutVariants: "Lager",
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      (config.baseUrl = "https://staging-demo.saleor.io/"),
        (config.env.ENVIRONMENT = "staging"),
        (config.env.userEmail = "admin@example.com"),
        (config.env.userPassword = "admin"),
        (config.env.digitalProduct = "cloud"),
        (config.env.productWithoutVariants = "beanie"),
        (config.env.API_URL = "https://staging-demo.saleor.io/graphql/");

      console.log(config.env);

      // IMPORTANT return the updated config object
      return config;
    },
  },
});

// email: "admin@example.com",
// password: "admin",
