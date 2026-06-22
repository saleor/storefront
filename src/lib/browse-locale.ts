import { getDefaultLocaleSlug, isStorefrontLocaleSlug, type LocaleSlug } from "@/config/locale";

/** Persists browse language for checkout and other non-prefixed surfaces (ADR 0001). */
export const BROWSE_LOCALE_COOKIE = "browse-locale";

export function getBrowseLocaleCookieOptions() {
	return {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
		sameSite: "lax" as const,
	};
}

export function resolveBrowseLocaleSlug(candidate?: string | null): LocaleSlug {
	if (candidate && isStorefrontLocaleSlug(candidate)) {
		return candidate;
	}
	return getDefaultLocaleSlug();
}

/** Read browse locale from `document.cookie` (client components, checkout). */
export function readBrowseLocaleSlug(): LocaleSlug | null {
	if (typeof document === "undefined") {
		return null;
	}

	const prefix = `${BROWSE_LOCALE_COOKIE}=`;
	const entry = document.cookie
		.split(";")
		.map((part) => part.trim())
		.find((part) => part.startsWith(prefix));
	if (!entry) {
		return null;
	}

	const value = decodeURIComponent(entry.slice(prefix.length));
	return isStorefrontLocaleSlug(value) ? value : null;
}

export function resolveBrowseLocaleSlugWithFallback(candidate?: string | null): LocaleSlug {
	return resolveBrowseLocaleSlug(candidate ?? readBrowseLocaleSlug());
}

/** Keep browse locale in sync after client-side locale switches (middleware may not run). */
export function writeBrowseLocaleCookieClient(slug: LocaleSlug): void {
	if (typeof document === "undefined" || !isStorefrontLocaleSlug(slug)) {
		return;
	}

	const { path, maxAge, sameSite } = getBrowseLocaleCookieOptions();
	document.cookie = `${BROWSE_LOCALE_COOKIE}=${encodeURIComponent(
		slug,
	)}; path=${path}; max-age=${maxAge}; samesite=${sameSite}`;
}
