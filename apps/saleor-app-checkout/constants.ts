import urlJoin from "url-join";
import { localhostHttp } from "./utils/configUtils";
export const appName = "Checkout";

export const isSsr = typeof window === "undefined";
export const saleorDomainHeader = "x-saleor-domain";
export const saleorTokenHeader = "x-saleor-token";

export type EnvVar = keyof typeof envVars;
export type ServerEnvVar = "appToken" | "settingsEncryptionSecret";
export type DebugEnvVar = "appUrl";

export type EnvVars = Record<EnvVar, string>;
export type ServerEnvVars = Record<ServerEnvVar, string | undefined>;
export type DebugEnvVars = Record<DebugEnvVar, string | undefined>;

// Need to use `var variable = process.env.VARIABLE;`, not `var env = process.env; var variable = env.VARIABLE;`
// https://github.com/vercel/next.js/issues/19420
export const envVars = {
  apiUrl: localhostHttp(process.env["NEXT_PUBLIC_SALEOR_API_URL"]!),
  checkoutAppUrl: localhostHttp(process.env["NEXT_PUBLIC_CHECKOUT_APP_URL"]!),
  checkoutApiUrl: localhostHttp(
    process.env["NEXT_PUBLIC_CHECKOUT_APP_URL"]
      ? urlJoin(process.env["NEXT_PUBLIC_CHECKOUT_APP_URL"], `api`)
      : ""
  ),
};

export const envVarsNames: EnvVars = {
  apiUrl: "NEXT_PUBLIC_SALEOR_API_URL",
  checkoutAppUrl: "NEXT_PUBLIC_CHECKOUT_APP_URL",
  checkoutApiUrl: "NEXT_PUBLIC_CHECKOUT_APP_URL",
};

export const serverEnvVars: ServerEnvVars = {
  appToken: process.env["SALEOR_APP_TOKEN"]!,
  settingsEncryptionSecret: process.env["SETTINGS_ENCRYPTION_SECRET"],
};
export const serverEnvVarNames: Record<ServerEnvVar, string> = {
  appToken: "SALEOR_APP_TOKEN",
  settingsEncryptionSecret: "SETTINGS_ENCRYPTION_SECRET",
};

export const debugEnvVars: DebugEnvVars | null =
  process.env.NODE_ENV !== "development"
    ? null
    : {
        appUrl: process.env.DEBUG_APP_URL,
      };

export const IS_TEST = process.env.NODE_ENV === "test";
