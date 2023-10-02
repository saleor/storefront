"use client";

import { SaleorAuthProvider, useAuthChange } from "@saleor/auth-sdk/react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient, saleorAuthClient } from "@/lib";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	console.log({ "process.env.NEXT_PUBLIC_SALEOR_API_URL": process.env.NEXT_PUBLIC_SALEOR_API_URL });
	useAuthChange({
		saleorApiUrl: process.env.NEXT_PUBLIC_SALEOR_API_URL!,
		onSignedOut: () => apolloClient.resetStore(),
		onSignedIn: () => apolloClient.refetchQueries({ include: "all" }),
	});

	return (
		<SaleorAuthProvider client={saleorAuthClient}>
			<ApolloProvider client={apolloClient}>{children}</ApolloProvider>
		</SaleorAuthProvider>
	);
}
