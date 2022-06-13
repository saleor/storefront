/* eslint-disable no-restricted-globals */

export type EnvVar =
  | "apiUrl"
  | "devCheckoutToken"
  | "checkoutApiUrl"
  | "checkoutAppUrl";

export type EnvVars = Record<EnvVar, string>;

const env = process.env;

export const envVars: EnvVars = {
  apiUrl: env.REACT_APP_SALEOR_API_URL,
  devCheckoutToken: env.TEST_CHECKOUT_TOKEN,
  checkoutApiUrl: `${env.REACT_APP_CHECKOUT_APP_URL}/api`,
  checkoutAppUrl: env.REACT_APP_CHECKOUT_APP_URL,
} as EnvVars;
