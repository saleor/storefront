import type { AnnouncementBarContent } from "@/lib/content/types";

const DISMISS_PREFIX = "paper:announcement-dismissed";

/**
 * Cookie that stores the dismiss key of the announcement the shopper closed. The server
 * reads it in `DismissibleAnnouncementBar` (see `announcement-bar-slot.tsx`) to omit a dismissed bar
 * from the initial HTML. The dismiss island writes it client-side.
 */
export const ANNOUNCEMENT_DISMISS_COOKIE = "paper_announcement_dismissed";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function getAnnouncementDismissCookieOptions() {
	return {
		path: "/",
		maxAge: ONE_YEAR_SECONDS,
		sameSite: "lax" as const,
	};
}

/** `document.cookie` assignment for persisting a dismiss key (client-only). */
export function formatAnnouncementDismissCookie(dismissKey: string): string {
	const { path, maxAge, sameSite } = getAnnouncementDismissCookieOptions();
	return `${ANNOUNCEMENT_DISMISS_COOKIE}=${encodeURIComponent(
		dismissKey,
	)}; path=${path}; max-age=${maxAge}; samesite=${sameSite}`;
}

/**
 * True when `cookieValue` (the raw value from the dismiss cookie) marks `dismissKey` as
 * dismissed. Tolerates URI-encoded values so it matches regardless of whether the cookie
 * runtime decoded them — the keys we compare contain no `%`, so decoding is idempotent.
 */
export function isAnnouncementDismissed(cookieValue: string | undefined, dismissKey: string): boolean {
	if (!cookieValue) {
		return false;
	}
	try {
		return decodeURIComponent(cookieValue) === dismissKey;
	} catch {
		return cookieValue === dismissKey;
	}
}

/** FNV-1a 32-bit — deterministic in Node and the browser, no crypto deps. */
function hashAnnouncementContent(message: string, href: string | null, linkLabel: string | null): string {
	const payload = `${message.trim()}\0${href ?? ""}\0${linkLabel ?? ""}`;
	let hash = 2166136261;
	for (let i = 0; i < payload.length; i++) {
		hash ^= payload.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return (hash >>> 0).toString(36);
}

export type AnnouncementDismissInput = Pick<AnnouncementBarContent, "id" | "message" | "href" | "linkLabel">;

/**
 * Dismiss key stored in `ANNOUNCEMENT_DISMISS_COOKIE` when the shopper closes the bar.
 *
 * **Default (empty `id`):** hash of `message`, `href`, and `linkLabel` — pass the
 * **rendered** message (after `{freeShippingThreshold}` interpolation) so the key
 * matches what the shopper saw. Any copy change resets dismissals.
 *
 * **Override (non-empty `id`):** stable campaign slug from `announcement-id` in
 * Saleor or `defaults.ts` — dismissal survives message tweaks until `id` changes.
 */
export function resolveAnnouncementDismissKey({
	id,
	message,
	href,
	linkLabel,
}: AnnouncementDismissInput): string {
	const explicitId = id.trim();
	if (explicitId) {
		return `${DISMISS_PREFIX}:id:${explicitId}`;
	}
	return `${DISMISS_PREFIX}:content:${hashAnnouncementContent(message, href, linkLabel)}`;
}
