import { relayStylePagination } from "@apollo/client/utilities";

import { TypedTypePolicies } from "@/saleor/api";

import { formatAsMoney } from "./util";

export const typePolicies: TypedTypePolicies = {
  Money: {
    fields: {
      localizedAmount: {
        read(_, { readField, args }) {
          return formatAsMoney(readField("amount"), readField("currency"));
        },
      },
    },
  },
  User: {
    fields: {
      orders: relayStylePagination(),
    },
  },
  Query: {
    fields: {
      products: relayStylePagination(["filter"]),
    },
  },
};
