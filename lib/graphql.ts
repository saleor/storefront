import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { createFetch, createSaleorClient } from "@saleor/sdk";

import { API_URI } from "./const";
import { DEFAULT_CHANNEL } from "./regions";
import { typePolicies } from "./typePolicies";

const httpLink = createHttpLink({
  uri: API_URI,
  fetch: createFetch(),
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({ typePolicies }),
  ssrMode: typeof window === "undefined",
});

export const saleorClient = createSaleorClient({
  apiUrl: API_URI,
  channel: DEFAULT_CHANNEL.slug,
});

export default apolloClient;
