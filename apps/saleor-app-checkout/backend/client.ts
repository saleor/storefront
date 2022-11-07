import { createClient } from "urql";
import { envVars } from "../constants";
import { getAuthToken } from "./environment";

interface ClientParams {
  apiUrl?: string;
  appToken?: string;
}

export const getClient = (params: ClientParams = {}) => {
  const { apiUrl = envVars.apiUrl, appToken = getAuthToken() } = params;

  const client = createClient({
    url: apiUrl,
    requestPolicy: "network-only", // On SSR, Vercel uses client cache in consecutive requests, so we need network-only to always return fresh data from Saleor
    suspense: false,
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${appToken}`,
      },
    },
  });
  // client.subscribeToDebugTarget?.((e) => console.dir(e, { depth: 999 }));

  return client;
};
