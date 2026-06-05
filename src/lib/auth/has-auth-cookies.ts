import { AUTH_COOKIE_MARKERS } from "./constants";

/** Client-side check for Saleor auth cookies (matches server `hasAuthSession` markers). */
export function hasAuthCookies(): boolean {
	if (typeof document === "undefined") {
		return false;
	}

	return document.cookie
		.split(";")
		.some((cookie) => AUTH_COOKIE_MARKERS.some((marker) => cookie.includes(marker)));
}
