"use client";

import { SaleorAuthProvider, useAuthChange } from "@saleor/auth-sdk/react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient, saleorAuthClient } from "@/lib";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	useAuthChange({
		saleorApiUrl: process.env.SALEOR_API_URL!,
		onSignedOut: () => apolloClient.resetStore(),
		onSignedIn: () => apolloClient.refetchQueries({ include: "all" }),
	});

	return (
		<SaleorAuthProvider client={saleorAuthClient}>
			<ApolloProvider client={apolloClient}>{children}</ApolloProvider>
		</SaleorAuthProvider>
	);
}
