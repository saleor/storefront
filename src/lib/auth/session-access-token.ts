import "server-only";

import { SessionTokenCheckDocument } from "@/gql/graphql";
import { sessionQuery } from "@/lib/saleor";
import { getAuthStorageKeys } from "./has-auth-session";
import { createServerCookieStorage } from "./server";

/** True when a JWT expires within `graceSeconds` (or cannot be read). */
function isExpiring(token: string, graceSeconds = 30): boolean {
	try {
		const payload = JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8")) as {
			exp?: number;
		};
		return typeof payload.exp !== "number" || payload.exp * 1000 - graceSeconds * 1000 <= Date.now();
	} catch {
		return true;
	}
}

/**
 * The signed-in customer's Saleor access token, for server-to-server calls made on their behalf
 * (a withdrawal backend's order lookup). Never send it to the browser. `null` when nobody is signed
 * in, or when the token is expired and cannot be renewed here.
 *
 * Renewal goes through the data kernel: a session query lets the auth SDK refresh the token and
 * store it. In Server Actions that store reaches the cookie, so the token read afterwards is the
 * new one; during a render it does not, and this returns `null` (callers fall back).
 */
export async function getSessionAccessToken(): Promise<string | null> {
	const saleorApiUrl = process.env.NEXT_PUBLIC_SALEOR_API_URL;
	if (!saleorApiUrl) return null;
	const keys = getAuthStorageKeys(saleorApiUrl);
	const read = async () => (await createServerCookieStorage()).getItem(keys.access);

	const current = await read();
	if (current && !isExpiring(current)) return current;
	if (!(await createServerCookieStorage()).getItem(keys.refresh)) return null;

	await sessionQuery(SessionTokenCheckDocument).catch(() => null);
	const renewed = await read();
	return renewed && !isExpiring(renewed) ? renewed : null;
}
