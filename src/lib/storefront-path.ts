/**
 * Helpers for `/{locale}/{channel}/…` browse URLs (ADR 0001).
 */

export type StorefrontPathPrefix = {
	locale: string;
	channel: string;
	/** Path after channel, including leading slash — e.g. `/products/foo` or `` for homepage */
	suffix: string;
};

export function buildStorefrontPath(locale: string, channel: string, suffix = ""): string {
	const normalizedSuffix = suffix.startsWith("/") || suffix === "" ? suffix : `/${suffix}`;
	return `/${encodeURIComponent(locale)}/${encodeURIComponent(channel)}${normalizedSuffix}`;
}

/**
 * Parse a pathname into locale + channel + suffix when it matches the browse prefix.
 */
export function parseStorefrontPathname(pathname: string): StorefrontPathPrefix | null {
	const segments = pathname.split("/").filter(Boolean);
	if (segments.length < 2) return null;

	const [locale, channel, ...rest] = segments;
	return {
		locale: decodeURIComponent(locale),
		channel: decodeURIComponent(channel),
		suffix: rest.length > 0 ? `/${rest.join("/")}` : "",
	};
}

export function replaceStorefrontChannel(pathname: string, newChannel: string): string | null {
	const parsed = parseStorefrontPathname(pathname);
	if (!parsed) return null;
	return buildStorefrontPath(parsed.locale, newChannel, parsed.suffix);
}

export function replaceStorefrontLocale(pathname: string, newLocale: string): string | null {
	const parsed = parseStorefrontPathname(pathname);
	if (!parsed) return null;
	return buildStorefrontPath(newLocale, parsed.channel, parsed.suffix);
}

/** Strip `/{locale}/{channel}` for nav active-state matching. */
export function stripStorefrontPrefix(pathname: string, locale: string, channel: string): string {
	const prefix = `/${locale}/${channel}`;
	if (pathname === prefix || pathname === `${prefix}/`) {
		return "/";
	}
	if (pathname.startsWith(`${prefix}/`)) {
		return pathname.slice(prefix.length);
	}
	return pathname;
}
