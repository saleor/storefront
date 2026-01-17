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
import { withRetry } from "@/lib/fetchRetry";

const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

// Token lifetimes (industry standard for e-commerce)
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

/**
 * Encode storage key to be a valid cookie name.
 * The SDK uses keys like "https://api.example.com/graphql/+saleor_auth_access_token"
 * which contain invalid cookie characters (: and /). We encode these to make valid names.
 */
const encodeCookieName = (key: string): string => {
	return key.replace(/[^a-zA-Z0-9_-]/g, "_");
};

/**
 * Client-side cookie storage for auth tokens.
 * Shares tokens with server-side via cookies.
 *
 * SECURITY:
 * - Cookies are NOT HttpOnly (SDK needs client-side access for Authorization headers)
 * - SameSite=Lax provides CSRF protection
 * - Secure flag ensures HTTPS-only in production
 * - Short access token (15min) limits exposure window
 *
 * Production requirements:
 * - Strong Content Security Policy (CSP) headers
 * - Audit third-party scripts (XSS vectors)
 */
const createClientCookieStorage = () => {
	const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";

	return {
		getItem: (key: string): string | null => {
			if (typeof document === "undefined") return null;
			const cookieName = encodeCookieName(key);
			const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
			return match ? decodeURIComponent(match[2]) : null;
		},
		setItem: (key: string, value: string): void => {
			if (typeof document === "undefined") return;
			const cookieName = encodeCookieName(key);
			const maxAge = key.includes("refresh") ? REFRESH_TOKEN_MAX_AGE : ACCESS_TOKEN_MAX_AGE;
			const securePart = isSecure ? "; Secure" : "";
			document.cookie = `${cookieName}=${encodeURIComponent(
				value,
			)}; path=/; max-age=${maxAge}; SameSite=Lax${securePart}`;
		},
		removeItem: (key: string): void => {
			if (typeof document === "undefined") return;
			const cookieName = encodeCookieName(key);
			document.cookie = `${cookieName}=; path=/; max-age=0; SameSite=Lax`;
		},
	};
};

// Use cookie storage so tokens are shared between client and server
const clientCookieStorage = createClientCookieStorage();

export const saleorAuthClient = createSaleorAuthClient({
	saleorApiUrl,
	refreshTokenStorage: clientCookieStorage,
	accessTokenStorage: clientCookieStorage,
});

const makeUrqlClient = () => {
	const authFetch = (input: RequestInfo | URL, init?: RequestInit) =>
		saleorAuthClient.fetchWithAuth(input as NodeJS.fetch.RequestInfo, init);

	return createClient({
		url: saleorApiUrl,
		suspense: true,
		requestPolicy: "cache-first",
		// Type assertion needed due to urql's overloaded fetch type
		fetch: withRetry(authFetch) as typeof fetch,
		exchanges: [dedupExchange, cacheExchange, fetchExchange],
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
