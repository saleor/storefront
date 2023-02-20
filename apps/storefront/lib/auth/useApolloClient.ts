import { ApolloClient, createHttpLink, InMemoryCache, HttpOptions } from "@apollo/client";
import { useMemo } from "react";

import { typePolicies } from "./typePolicies";

// for static geenration of pages, we don't need auth there
export const staticApolloClient = new ApolloClient({
  cache: new InMemoryCache({ typePolicies }),
  ssrMode: true,
});

export const useApolloClient = (httpOptions: HttpOptions) => {
  const httpLink = createHttpLink(httpOptions);

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache({ typePolicies }),
      }),
    [httpLink]
  );

  return { apolloClient, resetClient: () => apolloClient.resetStore() };
};
