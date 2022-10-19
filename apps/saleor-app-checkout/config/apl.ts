import { FileAPL, UpstashAPL } from "@saleor/app-sdk/APL";
import invariant from "ts-invariant";

type Result = {
  saleorApiUrl: string;
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

export const get = async (saleorApiUrl: string): Promise<Result> => {
  const authData = await apl.get(saleorApiUrl);

  invariant(authData, `No auth data found for given host: ${saleorApiUrl}. Is the app installed?`);

  return {
    saleorApiUrl,
    appToken: authData.token,
  };
};

export const set = ({ saleorApiUrl, authToken }: { saleorApiUrl: string; authToken: string }) => {
  console.log(`APL SET`, { saleorApiUrl, authToken });

  return apl.set({ domain: saleorApiUrl, token: authToken });
};
