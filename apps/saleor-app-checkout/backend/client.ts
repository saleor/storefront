import { createClient } from "urql";
import { envVars } from "../constants";

interface ClientParams {
  apiUrl?: string;
  appToken: string;
}

export const getClient = (params: ClientParams) => {
  const { apiUrl = envVars.apiUrl, appToken } = params;
  if (!appToken) {
    throw new Error("Can't create client without the token");
  }

  return createClient({
    url: apiUrl,
    requestPolicy: "network-only", // On SSR, Vercel uses client cache in consecutive requests, so we need network-only to always return fresh data from Saleor
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    },
  });
};
