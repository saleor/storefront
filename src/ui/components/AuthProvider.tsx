"use client";

import { SaleorAuthProvider, useAuthChange } from "@saleor/auth-sdk/react";
import { invariant } from "ts-invariant";
import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { useState, type ReactNode } from "react";
import {
	type Client,
	Provider as UrqlProvider,
	cacheExchange,
	createClient,
	dedupExchange,
	fetchExchange,
} from "urql";
import { authErrorExchange } from "@/lib/urqlAuthErrorExchange";

const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

// Create a custom cookie-based storage for the browser that matches server-side behavior
const browserCookieStorage =
	typeof window !== "undefined"
		? {
				getItem(key: string): string | null {
					if (typeof document === "undefined") return null;
					const name = key + "=";
					const decodedCookie = decodeURIComponent(document.cookie);
					const ca = decodedCookie.split(";");
					for (let i = 0; i < ca.length; i++) {
						let c = ca[i];
						while (c.charAt(0) === " ") {
							c = c.substring(1);
						}
						if (c.indexOf(name) === 0) {
							return c.substring(name.length, c.length);
						}
					}
					return null;
				},
				setItem(key: string, value: string): void {
					if (typeof document === "undefined") return;
					// Set cookie with 30 day expiration, SameSite=Lax, and path=/
					const days = 30;
					const date = new Date();
					date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
					const expires = "expires=" + date.toUTCString();
					document.cookie = `${key}=${value};${expires};path=/;SameSite=Lax`;
				},
				removeItem(key: string): void {
					if (typeof document === "undefined") return;
					document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
				},
		  }
		: null;

export const saleorAuthClient = createSaleorAuthClient({
	saleorApiUrl,
	// Use browser cookies to match server-side cookie storage
	refreshTokenStorage: browserCookieStorage || undefined,
	accessTokenStorage: browserCookieStorage || undefined,
});

const makeUrqlClient = () => {
	return createClient({
		url: saleorApiUrl,
		suspense: true,
		// requestPolicy: "cache-first",
		fetch: (input, init) => saleorAuthClient.fetchWithAuth(input as NodeJS.fetch.RequestInfo, init),
		exchanges: [dedupExchange, cacheExchange, authErrorExchange, fetchExchange],
	});
};

export function AuthProvider({ children }: { children: ReactNode }) {
	invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

	const [urqlClient, setUrqlClient] = useState<Client>(() => makeUrqlClient());
	useAuthChange({
		saleorApiUrl,
		onSignedOut: () => {
			setUrqlClient(makeUrqlClient());
		},
		onSignedIn: () => {
			setUrqlClient(makeUrqlClient());
		},
	});

	return (
		<SaleorAuthProvider client={saleorAuthClient}>
			<UrqlProvider value={urqlClient}>{children}</UrqlProvider>
		</SaleorAuthProvider>
	);
}
