import { createClient } from "urql";

interface ClientParams {
  apiUrl: string;
  appToken: string;
}

export const getClientForAuthData = ({ apiUrl, appToken }: ClientParams) => {
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
