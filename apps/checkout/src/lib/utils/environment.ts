/* eslint-disable no-restricted-globals */

export type EnvVar = "apiUrl" | "checkoutAppUrl";

export type EnvVars = Record<EnvVar, string>;

const env = process.env;

export const envVars: EnvVars = {
  apiUrl: env.REACT_APP_SALEOR_API_URL,
  checkoutAppUrl: env.REACT_APP_CHECKOUT_API_URL,
} as EnvVars;
