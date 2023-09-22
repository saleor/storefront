'use client';

import { SaleorAuthProvider, useAuthChange } from "@saleor/auth-sdk/react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient, endpoint, saleorAuthClient } from "@/lib";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthChange({
    saleorApiUrl: endpoint,
    onSignedOut: () => apolloClient.resetStore(),
    onSignedIn: () => apolloClient.refetchQueries({ include: "all" })

  });

  return (
    <SaleorAuthProvider client={saleorAuthClient}>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </SaleorAuthProvider>
  )
}