import { createDebug } from "./../utils/debug";
/* eslint-disable class-methods-use-this */
import { APL, AuthData } from "@saleor/app-sdk/APL";

const debug = createDebug("RestAPL");

export type RestAPLConfig = {
  url: string;
  headers?: Record<string, string>;
};
export class RestAPL implements APL {
  private url: string;

  private headers?: Record<string, string>;

  constructor(config: RestAPLConfig) {
    this.url = config.url;
    this.headers = config.headers;
  }

  private urlForDomain(domain: string) {
    return `${this.url}/${domain}`;
  }

  async get(domain: string) {
    debug(`Get auth data for ${domain}`);
    let response;
    try {
      response = await fetch(this.urlForDomain(domain), {
        method: "GET",
        headers: { "Content-Type": "application/json", ...this.headers },
      });
    } catch (error) {
      debug(`Error during fetching %O`, error);
      throw new Error(`Attempt in fetch the data resulted with error: ${error}`);
    }

    if (response.status < 200 || response.status >= 400) {
      debug(`Non 200 response: ${response.status}`);
      throw new Error(`Fetch returned with non 200 status code ${response.status}`);
    }

    const parsed = (await response.json()) as any;
    if (parsed?.domain && parsed?.token) {
      debug(`Return auth data for the ${parsed?.domain}`);
      return { domain: parsed.domain as string, token: parsed.token as string };
    }
    debug(`No existing auth data`);
    return undefined;
  }

  async set(authData: AuthData) {
    debug("Set auth data: %O", authData);
    let response;
    try {
      response = await fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.headers },
        body: JSON.stringify(authData),
      });
    } catch (error) {
      debug("Error during sending request: %O", error);
      throw new Error(`Error during saving the data: ${error}`);
    }

    if (response.status < 200 || response.status >= 400) {
      debug(`Non 200 response: ${response.status}`);
      throw new Error(`Set response returned with non 200 status code ${response.status}`);
    }

    debug("Auth data set successfully");
    return undefined;
  }

  async delete(domain: string) {
    console.debug("Deleting data from Rest");
    try {
      const response = await fetch(this.urlForDomain(domain), {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...this.headers },
        body: JSON.stringify({ domain }),
      });
      console.debug(`Delete responded with ${response.status} code`);
    } catch (error) {
      console.debug("Error during deleting the data:", error);
    }
  }

  async getAll() {
    console.debug("Get all data from Rest");
    try {
      const response = await fetch(this.url, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...this.headers },
      });
      console.debug(`Get all responded with ${response.status} code`);

      return ((await response.json()) as AuthData[]) || [];
    } catch (error) {
      console.debug("Error during getting all the data:", error);
    }
    return [];
  }
}
