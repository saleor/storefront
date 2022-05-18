import { createClient } from "urql";

export const client = createClient({
  url: process.env.NEXT_PUBLIC_SALEOR_API_URL!,
  requestPolicy: "network-only", // On SSR, Vercel uses client cache in consecutive requests, so we need network-only to always return fresh data from Saleor
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN!}`,
    },
  },
});
