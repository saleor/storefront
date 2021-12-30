import { relayStylePagination } from "@apollo/client/utilities";

import { TypedTypePolicies } from "@/saleor/api";

import { languageCodeToLocale } from "./regions";
import { formatAsMoney } from "./util";

export const typePolicies: TypedTypePolicies = {
  Money: {
    fields: {
      localizedAmount: {
        read(_, { readField, variables }) {
          const locale = languageCodeToLocale(variables?.locale);
          return formatAsMoney(
            readField("amount"),
            readField("currency"),
            locale
          );
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
