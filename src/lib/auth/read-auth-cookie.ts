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
	const all = cookieStore.getAll();

	const forApi = all.find((cookie) => cookie.name.startsWith(apiPrefix) && cookie.name.includes(marker));
	if (forApi?.value) {
		return decodeCookieValue(forApi.value);
	}

	const any = all.find((cookie) => cookie.name.includes(marker) && cookie.value);
	return any?.value ? decodeCookieValue(any.value) : null;
}
