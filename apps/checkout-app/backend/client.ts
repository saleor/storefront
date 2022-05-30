import { createClient } from "urql";

export const getClient = (apiUrl: string, appToken: string) =>
  createClient({
    url: apiUrl!,
    requestPolicy: "network-only", // On SSR, Vercel uses client cache in consecutive requests, so we need network-only to always return fresh data from Saleor
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${appToken!}`,
      },
    },
  });
