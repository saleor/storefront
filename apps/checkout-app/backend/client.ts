import { createClient } from "urql";

export const client = createClient({
  url: process.env.NEXT_PUBLIC_API_URL!,
  fetch,
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN!}`,
    },
  },
});
