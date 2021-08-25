import { ApolloClient, InMemoryCache } from "@apollo/client";
import { TypedTypePolicies } from "../saleor/api";

const typePolicies: TypedTypePolicies = {
  Product: {
    keyFields: ["id"],
  },
  Collection: {
    keyFields: ["slug"],
  },
  Query: {
    fields: {
      products: {
        keyArgs: ["type"],
        merge(existing, incoming, { readField }) {
          const merged = { ...incoming };
          if (!!existing?.edges && !!incoming?.edges) {
            merged.edges = existing.edges.concat(incoming.edges);
          }
          return merged;
        },

        read(existing) {
          return existing;
        },
      },
    },
  },
};

const client = new ApolloClient({
  uri: "https://vercel.saleor.cloud/graphql/",
  cache: new InMemoryCache({ typePolicies }),
});

export default client;
