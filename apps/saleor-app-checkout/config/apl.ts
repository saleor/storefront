import { FileAPL } from "@saleor/app-sdk/APL";
import invariant from "ts-invariant";

const apl = new FileAPL();

export const get = async (saleorApiHost: string) => {
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
  return apl.set({ domain: saleorApiHost, token: authToken });
};
