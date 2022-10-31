import { APL, AuthData } from "@saleor/app-sdk/APL";
import invariant, { InvariantError } from "ts-invariant";

const getEnvVariables = () => {
  const NEXT_PUBLIC_SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL;
  const SALEOR_APP_TOKEN = process.env.SALEOR_APP_TOKEN;
  invariant(NEXT_PUBLIC_SALEOR_API_URL, "Missing NEXT_PUBLIC_SALEOR_API_URL!");
  invariant(SALEOR_APP_TOKEN, "Missing SALEOR_APP_TOKEN!");

  return { NEXT_PUBLIC_SALEOR_API_URL, SALEOR_APP_TOKEN };
};

export class CheckoutVercelAPL implements APL {
  async get() {
    const { NEXT_PUBLIC_SALEOR_API_URL, SALEOR_APP_TOKEN } = getEnvVariables();
    const domain = new URL(NEXT_PUBLIC_SALEOR_API_URL).hostname;

    return {
      domain,
      token: SALEOR_APP_TOKEN,
    };
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
    return [await this.get()];
  }
  async isReady() {
    try {
      getEnvVariables();
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
      getEnvVariables();
      return { configured: true as const };
    } catch (err) {
      return {
        configured: false as const,
        error: err as InvariantError,
      };
    }
  }
}
