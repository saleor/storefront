import { FileAPL, UpstashAPL } from "@saleor/app-sdk/APL";
import invariant from "ts-invariant";
import Fs from "fs/promises";
import { unpackPromise } from "../utils/unpackErrors";

type Result = {
  saleorApiUrl: string;
  appToken: string;
};

// @TODO: Use an env variable for single-tenant Vercel deployments?
const useFileAPL = process.env.APL === "file";

if (useFileAPL) {
  void printAplWarning();
}

const apl = useFileAPL
  ? new FileAPL()
  : (() => {
      const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
      const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

      invariant(UPSTASH_REDIS_REST_URL, "Missing UPSTASH_REDIS_REST_URL!");
      invariant(UPSTASH_REDIS_REST_TOKEN, "Missing UPSTASH_REDIS_REST_TOKEN!");

      return new UpstashAPL({
        restURL: UPSTASH_REDIS_REST_URL,
        restToken: UPSTASH_REDIS_REST_TOKEN,
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
  return apl.set({ domain: saleorApiUrl, token: authToken });
};

async function printAplWarning() {
  const [_authTokenError, authToken] = await unpackPromise(Fs.readFile(".auth_token", "utf-8"));
  const NEXT_PUBLIC_SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL;

  const Underscore = "\x1b[4m";
  const FgYellow = "\x1b[33m";
  const Reset = "\x1b[0m";

  if (authToken || NEXT_PUBLIC_SALEOR_API_URL) {
    console.warn(`
${FgYellow}${Underscore}WARNING!${Reset} Looks like you're using the deprecated \`.auth_token\` file or the deprecated NEXT_PUBLIC_SALEOR_API_URL env variable.
Please remove them and use an APL instead. Create \`.saleor-app-auth.json\` file and add the following JSON to it:
${FgYellow}{
${FgYellow}  "token": "${"(your application's auth token)"}",
${FgYellow}  "domain": "${NEXT_PUBLIC_SALEOR_API_URL || "(your Saleor GraphQL API URL)"}"
${FgYellow}}
`);
  }
}
