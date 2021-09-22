import { relayStylePagination } from "@apollo/client/utilities";

import { TypedTypePolicies } from "@/saleor/api";

import { formatAsMoney } from "./util";

export const typePolicies: TypedTypePolicies = {
  Product: {
    fields: {
      description: {
        read(data) {
          return JSON.parse(data);
        },
      },
    },
  },
  Money: {
    fields: {
      localizedAmount: {
        read(_, { readField }) {
          return formatAsMoney(readField("amount"), readField("currency"));
        },
      },
    },
  },
  Query: {
    fields: {
      products: relayStylePagination(),
    },
  },
};
