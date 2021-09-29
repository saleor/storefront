import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createSaleorClient } from "@saleor/sdk";
import { autoRefreshFetch } from "@saleor/sdk";
import { typePolicies } from "./typePolicies";
import { API_URI, DEFAULT_CHANNEL } from "./const";

const httpLink = createHttpLink({
  uri: API_URI,
  fetch: autoRefreshFetch,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token = "";
  if (process.browser) {
    // Client-side-only code
    token = localStorage.getItem("saleorAuthToken") || "";
  }

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({ typePolicies }),
  ssrMode: !process.browser,
});

export const saleorClient = createSaleorClient({
  apiUrl: API_URI,
  channel: DEFAULT_CHANNEL,
});

export default apolloClient;
