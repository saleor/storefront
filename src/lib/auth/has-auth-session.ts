import "server-only";

import { cookies } from "next/headers";
import { invariant } from "ts-invariant";

import { readAuthCookieValue } from "./read-auth-cookie";

function getAuthStorageKeys(saleorApiUrl: string) {
	return {
		access: [saleorApiUrl, "saleor_auth_access_token"].join("+"),
		refresh: [saleorApiUrl, "saleor_auth_module_refresh_token"].join("+"),
	};
}

/** Same cookie resolution as `getServerAuthClient().fetchWithAuth`. */
export async function getAuthTokenPresence(): Promise<{ hasAccess: boolean; hasRefresh: boolean }> {
	try {
		const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
		invariant(saleorApiUrl, "Missing NEXT_PUBLIC_SALEOR_API_URL env variable");

		const cookieStore = await cookies();
		const keys = getAuthStorageKeys(saleorApiUrl);

		return {
			hasAccess: readAuthCookieValue(cookieStore, keys.access, saleorApiUrl) !== null,
			hasRefresh: readAuthCookieValue(cookieStore, keys.refresh, saleorApiUrl) !== null,
		};
	} catch {
		return { hasAccess: false, hasRefresh: false };
	}
}

/**
 * True when Saleor auth tokens are present on the request (access or refresh).
 * Uses the same lookup as the auth SDK — not a loose cookie-name scan.
 */
export async function hasAuthSession(): Promise<boolean> {
	const { hasAccess, hasRefresh } = await getAuthTokenPresence();
	return hasAccess || hasRefresh;
}
