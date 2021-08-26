import { ApolloClient, InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import { TypedTypePolicies } from "../saleor/api";

const typePolicies: TypedTypePolicies = {
  Query: {
    fields: {
      products: relayStylePagination(),
    },
  },
};

const apolloClient = new ApolloClient({
  uri: "https://vercel.saleor.cloud/graphql/",
  cache: new InMemoryCache({ typePolicies }),
  ssrMode: typeof window === "undefined",
});

export default apolloClient;
