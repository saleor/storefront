import { Fetch } from "@/lib/auth/types";
import { API_URI } from "@/lib/const";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { useMemo } from "react";

import { typePolicies } from "./typePolicies";

// for static geenration of pages, we don't need auth there
export const serverApolloClient = new ApolloClient({
  link: createHttpLink({ uri: API_URI }),
  cache: new InMemoryCache({ typePolicies }),
  ssrMode: true,
});

export const useAuthenticatedApolloClient = (fetchWithAuth: Fetch) => {
  const httpLink = createHttpLink({
    uri: API_URI,
    fetch: fetchWithAuth,
  });

  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache({ typePolicies }),
      }),
    []
  );

  return { apolloClient, resetClient: () => apolloClient.resetStore() };
};
