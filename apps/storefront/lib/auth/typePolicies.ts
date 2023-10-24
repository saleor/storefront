import { relayStylePagination } from "@apollo/client/utilities";

import { TypedTypePolicies } from "@/saleor/api";

export const typePolicies: TypedTypePolicies = {
  User: {
    fields: {
      orders: relayStylePagination(),
    },
  },
  Query: {
    fields: {
      products: relayStylePagination(["filter", "sortBy"]),
    },
  },
  ExternalSale: {
    keyFields: ["id"],
    fields: {
      products: {
        keyArgs: false,
        merge(existing, incoming) {
          if (!incoming) return existing;
          if (!existing) return incoming;

          const { edges, ...rest } = incoming;
          // We only need to merge the nodes array.
          // The rest of the fields (pagination) should always be overwritten by incoming
          return {
            ...rest,
            edges: [...existing.edges, ...edges],
          };
        },
      },
    },
  },
};

export default typePolicies;
