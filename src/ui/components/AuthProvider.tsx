"use client";

import { SaleorAuthProvider, useAuthChange } from "@saleor/auth-sdk/react";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { invariant } from "ts-invariant";
import { createSaleorAuthClient } from "@saleor/auth-sdk";

const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

export const saleorAuthClient = createSaleorAuthClient({
	saleorApiUrl,
});

export const apolloClient = new ApolloClient({
	link: createHttpLink({
		uri: saleorApiUrl,
		fetch: saleorAuthClient.fetchWithAuth,
	}),
	cache: new InMemoryCache(),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");
	useAuthChange({
		saleorApiUrl,
		onSignedOut: () => apolloClient.resetStore(),
		onSignedIn: () => apolloClient.refetchQueries({ include: "all" }),
	});

	return (
		<SaleorAuthProvider client={saleorAuthClient}>
			<ApolloProvider client={apolloClient}>{children}</ApolloProvider>
		</SaleorAuthProvider>
	);
}
