import { FileAPL, UpstashAPL } from "@saleor/app-sdk/APL";
import invariant from "ts-invariant";

type Result = {
  apiUrl: string;
  saleorApiHost: string;
  domain: string;
  appToken: string;
};

const useFileAPL = false;

const apl = useFileAPL
  ? new FileAPL()
  : (() => {
      const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
      const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

      invariant(UPSTASH_REDIS_REST_URL, "Missing UPSTASH_REDIS_REST_URL!");
      invariant(UPSTASH_REDIS_REST_TOKEN, "Missing UPSTASH_REDIS_REST_TOKEN!");

      return new UpstashAPL({
        restURL: process.env.UPSTASH_REDIS_REST_URL!,
        restToken: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
    })();

export const get = async (saleorApiHost: string): Promise<Result> => {
  const authData = await apl.get(saleorApiHost);

  invariant(authData, `No auth data found for given host: ${saleorApiHost}. Is the app installed?`);

  const apiUrl = `https://${authData.domain}/graphql/`;

  return {
    apiUrl,
    saleorApiHost,
    domain: authData.domain,
    appToken: authData.token,
  };
};

export const set = ({ saleorApiHost, authToken }: { saleorApiHost: string; authToken: string }) => {
  console.log(`APL SET`, { saleorApiHost, authToken });

  return apl.set({ domain: saleorApiHost, token: authToken });
};
