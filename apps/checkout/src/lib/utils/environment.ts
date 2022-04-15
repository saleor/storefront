/* eslint-disable no-restricted-globals */

export type EnvVar = "apiUrl" | "devCheckoutToken" | "configAppUrl";

export interface EnvVars
  extends Omit<Record<EnvVar, string>, "devCheckoutToken"> {
  devCheckoutToken?: string;
}

const env = process.env;

export const envVars: EnvVars = {
  apiUrl: env.REACT_APP_API_URL,
  devCheckoutToken: env.TEST_CHECKOUT_TOKEN,
  configAppUrl: env.REACT_APP_CONFIG_APP_URL,
} as EnvVars;
