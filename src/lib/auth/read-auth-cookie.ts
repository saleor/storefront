import { decodeCookieValue, encodeCookieName } from "./constants";

type CookieStore = {
	get: (name: string) => { value: string } | undefined;
	getAll: () => Array<{ name: string; value: string }>;
};

export function storageKeyMarker(storageKey: string): string {
	return storageKey.includes("refresh") ? "saleor_auth_module_refresh_token" : "saleor_auth_access_token";
}

/**
 * Read a Saleor auth storage value from request cookies.
 * Tries the exact encoded SDK key first, then scans by API URL prefix and marker.
 *
 * Deliberately never matches cookies from a *different* Saleor instance: a token
 * minted by a previously configured NEXT_PUBLIC_SALEOR_API_URL would make
 * `hasAuthSession()` report a session that the current API always rejects,
 * wedging the header user menu in the "unavailable" state.
 */
export function readAuthCookieValue(
	cookieStore: CookieStore,
	storageKey: string,
	saleorApiUrl: string,
): string | null {
	const primaryName = encodeCookieName(storageKey);
	const primary = cookieStore.get(primaryName)?.value;
	if (primary) {
		return decodeCookieValue(primary);
	}

	const apiPrefix = encodeCookieName(saleorApiUrl);
	const marker = storageKeyMarker(storageKey);

	const forApi = cookieStore
		.getAll()
		.find((cookie) => cookie.name.startsWith(apiPrefix) && cookie.name.includes(marker));
	return forApi?.value ? decodeCookieValue(forApi.value) : null;
}
