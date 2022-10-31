import { FileAPL, UpstashAPL } from "@saleor/app-sdk/APL";
import invariant from "ts-invariant";
import Fs from "fs/promises";
import { unpackPromise } from "../utils/unpackErrors";
import { CheckoutVercelAPL } from "./checkoutVercelApl";

type Result = {
  saleorApiUrl: string;
  appToken: string;
};

const getApl = () => {
  switch (process.env.APL) {
    case "upstash":
      return (() => {
        const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
        const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

        invariant(UPSTASH_REDIS_REST_URL, "Missing UPSTASH_REDIS_REST_URL!");
        invariant(UPSTASH_REDIS_REST_TOKEN, "Missing UPSTASH_REDIS_REST_TOKEN!");

        return new UpstashAPL({
          restURL: UPSTASH_REDIS_REST_URL,
          restToken: UPSTASH_REDIS_REST_TOKEN,
        });
      })();
    case "file":
      void printFileAplWarning();
      return new FileAPL();
    case "vercel":
      return new CheckoutVercelAPL();
    default:
      invariant(
        false,
        `Unsupported APL env variable: ${
          process.env.APL || "(no value)"
        }. Use one of the supported values: "upstash", "file", "vercel".`
      );
  }
};

const apl = getApl();

export const get = async (saleorApiUrl: string): Promise<Result> => {
  const authData = await apl.get(saleorApiUrl);

  invariant(
    authData,
    `No auth data found for given host: ${saleorApiUrl}. Is the app installed and configured?`
  );

  return {
    saleorApiUrl,
    appToken: authData.token,
  };
};

export const set = ({ saleorApiUrl, authToken }: { saleorApiUrl: string; authToken: string }) => {
  return apl.set({ domain: saleorApiUrl, token: authToken });
};

async function printFileAplWarning() {
  const Underscore = "\x1b[4m";
  const FgYellow = "\x1b[33m";
  const Reset = "\x1b[0m";

  const h = (text: string) => `${FgYellow}${Underscore}${text}${Reset}`;
  const c = (text: string) => `${FgYellow}${text}${Reset}`;

  if (process.env.VERCEL) {
    console.warn(
      // prettier-ignore
      `
${h('WARNING!')} Looks like you're trying to use the "file" APL while deploying to Vercel.
This is not recommended, as the file APL is not persistent and will be lost on every deployment.
Please, set ${c('APL=vercel')}, ${c('NEXT_PUBLIC_SALEOR_API_URL')}, and ${c('SALEOR_APP_TOKEN')} env variables in Vercel configuration.
`.trim()
    );
    return;
  }

  const [_authTokenError, authToken] = await unpackPromise(Fs.readFile(".auth_token", "utf-8"));
  const NEXT_PUBLIC_SALEOR_API_URL = process.env.NEXT_PUBLIC_SALEOR_API_URL;

  if (authToken || NEXT_PUBLIC_SALEOR_API_URL) {
    console.warn(
      // prettier-ignore
      `
${h('WARNING!')} Looks like you're using the deprecated \`.auth_token\` file or the deprecated NEXT_PUBLIC_SALEOR_API_URL env variable.
Please remove them, create \`.saleor-app-auth.json\` file and add the following JSON to it:
${c(`{`)}
${c(`  "token": "(your application\'s auth token)",`)}
${c(`  "domain": "${NEXT_PUBLIC_SALEOR_API_URL || "(your Saleor GraphQL API URL)"}"`)}
${c(`}`)}
${Reset}
`.trim()
    );
  }
}
