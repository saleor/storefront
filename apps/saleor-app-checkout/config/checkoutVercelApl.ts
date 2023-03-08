import { APL, AuthData } from "@saleor/app-sdk/APL";
import invariant, { InvariantError } from "ts-invariant";

const getAuthDataFromEnvVariables = (): AuthData => {
  const NEXT_PUBLIC_SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL;
  invariant(NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL!");

  const SALEOR_APP_TOKEN = process.env.SALEOR_APP_TOKEN;
  invariant(SALEOR_APP_TOKEN, "Missing SALEOR_APP_TOKEN!");

  const SALEOR_APP_ID = process.env.SALEOR_APP_ID;
  invariant(SALEOR_APP_ID, "Missing SALEOR_APP_ID!");

  const SALEOR_APP_JWKS = process.env.SALEOR_APP_JWKS;
  invariant(SALEOR_APP_JWKS, "Missing SALEOR_APP_JWKS!");

  const domain = new URL(NEXT_PUBLIC_SALEOR_API_URL).hostname;

  return {
    saleorApiUrl: NEXT_PUBLIC_SALEOR_API_URL,
    token: SALEOR_APP_TOKEN,
    appId: SALEOR_APP_ID,
    jwks: SALEOR_APP_JWKS,
    domain,
  };
};

export class CheckoutVercelAPL implements APL {
  async get(saleorApiUrl: string) {
    const authData = getAuthDataFromEnvVariables();

    if (saleorApiUrl !== authData.saleorApiUrl) {
      console.log(
        `Saleor API URL mismatch. Requested AuthData for ${saleorApiUrl}, and environment is configured for ${authData.saleorApiUrl}.`
      );
      return;
    }

    return authData;
  }
  async set(_authData: AuthData) {
    console.log(
      `CheckoutVercelAPL: Not setting auth data for domain because CheckoutVercelAPL is used.`
    );
    // do nothing
  }
  async delete(_domain: string) {
    console.log(
      `CheckoutVercelAPL: Not deleting auth data for domain because CheckoutVercelAPL is used.`
    );
    // do nothing
  }
  async getAll() {
    return [getAuthDataFromEnvVariables()];
  }
  async isReady() {
    try {
      getAuthDataFromEnvVariables();
      return { ready: true as const };
    } catch (err) {
      return {
        ready: false as const,
        error: err as InvariantError,
      };
    }
  }
  async isConfigured() {
    try {
      getAuthDataFromEnvVariables();
      return { configured: true as const };
    } catch (err) {
      return {
        configured: false as const,
        error: err as InvariantError,
      };
    }
  }
}
