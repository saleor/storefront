import { AuthData } from "@saleor/app-sdk/APL";
import { createClient } from "urql";

export const getClientForAuthData = ({ saleorApiUrl, token }: AuthData) => {
  const client = createClient({
    url: saleorApiUrl,
    requestPolicy: "network-only", // On SSR, Vercel uses client cache in consecutive requests, so we need network-only to always return fresh data from Saleor
    suspense: false,
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
  // client.subscribeToDebugTarget?.((e) => console.dir(e, { depth: 999 }));

  return client;
};
