/* eslint-disable no-restricted-globals */

export type EnvVar = "apiUrl" | "devCheckoutToken" | "checkoutAppUrl";

export interface EnvVars
  extends Omit<Record<EnvVar, string>, "devCheckoutToken"> {
  devCheckoutToken?: string;
}

const env = process.env;

export const envVars: EnvVars = {
  apiUrl: env.REACT_APP_SALEOR_API_URL,
  devCheckoutToken: env.TEST_CHECKOUT_TOKEN,
  checkoutAppUrl: env.REACT_APP_CHECKOUT_API_URL,
} as EnvVars;
