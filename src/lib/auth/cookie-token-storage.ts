import { encodeCookieName } from "./constants";
import { readAuthCookieValue } from "./read-auth-cookie";

export type WritableCookieStore = {
	get: (name: string) => { value: string } | undefined;
	getAll: () => Array<{ name: string; value: string }>;
	set: (name: string, value: string, options?: Record<string, unknown>) => void;
	delete: (name: string) => void;
};

/** Storage shape consumed by `@saleor/auth-sdk`'s `createSaleorAuthClient`. */
export type TokenStorage = {
	getItem: (key: string) => string | null;
	setItem: (key: string, value: string) => void;
	removeItem: (key: string) => void;
};

export type CookieTokenStorageOptions = {
	secure: boolean;
	accessTokenMaxAge: number;
	refreshTokenMaxAge: number;
};

/**
 * Cookie-backed token storage with an in-memory cache layer.
 *
 * Writes go to the cache first, then attempt the cookie; reads check the cache
 * first. During an RSC render, cookie writes throw (cookies are read-only
 * outside Server Actions / Route Handlers) and are swallowed — but the cache
 * still holds the value.
 *
 * This mirrors `@saleor/auth-sdk`'s own `getNextServerCookiesStorageAsync` and
 * is what lets the SDK's refresh-then-reread flow succeed during render: when an
 * expired access token is refreshed mid-render, `runAuthorizedRequest` re-reads
 * the freshly minted token from the cache instead of the stale cookie. Without
 * the cache, the request would go out with the expired token and fail, making
 * an authenticated user appear signed out until a Server Action persists the
 * refreshed token.
 *
 * The cache is per-instance (created per request auth flow), so tokens never
 * leak across requests.
 */
export function createCookieTokenStorage(
	cookieStore: WritableCookieStore,
	saleorApiUrl: string,
	options: CookieTokenStorageOptions,
): TokenStorage {
	const cache = new Map<string, string>();

	return {
		getItem: (key) => {
			const cached = cache.get(key);
			if (cached !== undefined) {
				return cached;
			}
			return readAuthCookieValue(cookieStore, key, saleorApiUrl);
		},
		setItem: (key, value) => {
			cache.set(key, value);
			const cookieName = encodeCookieName(key);
			const maxAge = key.includes("refresh") ? options.refreshTokenMaxAge : options.accessTokenMaxAge;
			try {
				cookieStore.set(cookieName, value, {
					httpOnly: true,
					sameSite: "lax",
					secure: options.secure,
					path: "/",
					maxAge,
				});
			} catch {
				// Read-only context (RSC render) — the cache retains the value.
			}
		},
		removeItem: (key) => {
			cache.delete(key);
			const cookieName = encodeCookieName(key);
			try {
				cookieStore.delete(cookieName);
			} catch {
				// Read-only context (RSC render).
			}
		},
	};
}
