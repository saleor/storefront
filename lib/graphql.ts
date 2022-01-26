import { createSaleorClient } from "@saleor/sdk";
import { createClient } from "urql";

import { API_URI } from "./const";
import { DEFAULT_CHANNEL } from "./regions";

const apolloClient = createClient({
  url: API_URI,
});

export const saleorClient = createSaleorClient({
  apiUrl: API_URI,
  channel: DEFAULT_CHANNEL.slug,
});

export default apolloClient;
