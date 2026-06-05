import "server-only";

import { cookies } from "next/headers";
import { AUTH_COOKIE_MARKERS } from "./constants";

/**
 * True when Saleor auth cookies are present on the request.
 * Returns false during static prerender (cookies() unavailable) or when logged out.
 */
export async function hasAuthSession(): Promise<boolean> {
	try {
		const cookieStore = await cookies();
		return cookieStore
			.getAll()
			.some((cookie) => AUTH_COOKIE_MARKERS.some((marker) => cookie.name.includes(marker)));
	} catch {
		return false;
	}
}
