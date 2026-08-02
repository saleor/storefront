import { checkoutIdCookieName } from "@paper/session-bridge";

/** Client-side: whether a non-empty cart cookie exists for the given channel. */
export function hasCartCookieForChannel(channel: string): boolean {
	if (typeof document === "undefined") return false;

	const prefix = `${checkoutIdCookieName(channel)}=`;
	return document.cookie.split(";").some((part) => {
		const trimmed = part.trim();
		if (!trimmed.startsWith(prefix)) return false;
		const value = trimmed.slice(prefix.length);
		return value.length > 0;
	});
}
