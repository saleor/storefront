import { ApolloClient, InMemoryCache } from "@apollo/client";

import { typePolicies } from "./typePolicies";

const apolloClient = new ApolloClient({
  uri: "https://vercel.saleor.cloud/graphql/",
  cache: new InMemoryCache({ typePolicies }),
  ssrMode: typeof window === "undefined",
});

export default apolloClient;
