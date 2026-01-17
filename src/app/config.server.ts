import "server-only";

import { createSaleorAuthClient } from "@saleor/auth-sdk";
import { cookies } from "next/headers";
import { invariant } from "ts-invariant";

const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

// Token lifetimes (must match AuthProvider.tsx)
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

/**
 * Encode storage key to be a valid cookie name.
 * Must match the encoding in AuthProvider.tsx on the client side.
 */
const encodeCookieName = (key: string): string => {
	return key.replace(/[^a-zA-Z0-9_-]/g, "_");
};

/**
 * Server-side cookie storage for auth tokens.
 * Uses the same key encoding as the client-side storage to share cookies.
 * Does NOT set httpOnly so client can also read/write these cookies.
 */
const createServerCookieStorage = async () => {
	const cookieStore = await cookies();
	const isSecure = process.env.NODE_ENV === "production";

	return {
		getItem: (key: string): string | null => {
			const cookieName = encodeCookieName(key);
			return cookieStore.get(cookieName)?.value ?? null;
		},
		setItem: (key: string, value: string): void => {
			const cookieName = encodeCookieName(key);
			const maxAge = key.includes("refresh") ? REFRESH_TOKEN_MAX_AGE : ACCESS_TOKEN_MAX_AGE;
			try {
				cookieStore.set(cookieName, value, {
					httpOnly: false,
					sameSite: "lax",
					secure: isSecure,
					path: "/",
					maxAge,
				});
			} catch {
				// Ignore errors in read-only contexts (during render)
			}
		},
		removeItem: (key: string): void => {
			const cookieName = encodeCookieName(key);
			try {
				cookieStore.delete(cookieName);
			} catch {
				// Ignore errors in read-only contexts
			}
		},
	};
};

export const getServerAuthClient = async () => {
	const serverCookieStorage = await createServerCookieStorage();
	return createSaleorAuthClient({
		saleorApiUrl,
		refreshTokenStorage: serverCookieStorage,
		accessTokenStorage: serverCookieStorage,
	});
};
