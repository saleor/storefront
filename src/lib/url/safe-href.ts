/**
 * Shared href safety for CMS / menu / Saleor attribute input.
 * Blocks javascript:, data:, and other dangerous schemes before they reach `<a href>`.
 */

/** Absolute http(s) only — for external-only surfaces (e.g. photo credits). */
export function isSafeExternalHref(href: string): boolean {
	try {
		const url = new URL(href);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}

/** Storefront-relative paths: `/…` but not protocol-relative (`//…`, `/\…`). */
export function isSafeInternalHref(href: string): boolean {
	const trimmed = href.trim();
	if (!trimmed.startsWith("/")) {
		return false;
	}
	// Browsers normalize backslashes to slashes, so `/\evil.com` and `//evil.com`
	// are both treated as protocol-relative external URLs — reject them.
	return trimmed[1] !== "/" && trimmed[1] !== "\\";
}

export function isSafeMailtoHref(href: string): boolean {
	try {
		const url = new URL(href);
		return url.protocol === "mailto:";
	} catch {
		return false;
	}
}

/** Safe for nav/CTA anchors: http(s), mailto, or internal path. */
export function isSafeNavHref(href: string): boolean {
	const trimmed = href.trim();
	if (!trimmed) {
		return false;
	}
	return isSafeExternalHref(trimmed) || isSafeMailtoHref(trimmed) || isSafeInternalHref(trimmed);
}

/** Returns a trimmed safe href or null when the value must not be linked. */
export function sanitizeNavHref(href: string | null | undefined): string | null {
	const trimmed = href?.trim();
	if (!trimmed || !isSafeNavHref(trimmed)) {
		return null;
	}
	return trimmed;
}
