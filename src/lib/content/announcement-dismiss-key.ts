import type { AnnouncementBarContent } from "@/lib/content/types";

const DISMISS_PREFIX = "paper:announcement-dismissed";

/**
 * Cookie that stores the dismiss key of the announcement the shopper closed. The server
 * reads it (see `announcement-bar-slot.tsx`) to omit a dismissed bar from the initial
 * HTML — no flash, no inline script. The dismiss island writes it client-side.
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

/** `data-*` attribute carrying the cookie name into {@link ANNOUNCEMENT_NO_FLASH_SCRIPT}. */
export const ANNOUNCEMENT_NO_FLASH_COOKIE_ATTR = "data-announcement-cookie";
/** `data-*` attribute carrying the dismiss key into {@link ANNOUNCEMENT_NO_FLASH_SCRIPT}. */
export const ANNOUNCEMENT_NO_FLASH_KEY_ATTR = "data-announcement-key";

/**
 * Static, no-flash inline script for the dismissible bar — the canonical anti-FOUC pattern
 * (same shape as flash-free dark-mode scripts). If the dismiss cookie matches, it hides the
 * bar and zeroes `--announcement-bar-height` before first paint, covering the Suspense
 * fallback window while `DismissibleAnnouncementBar` streams (the server omits the bar once
 * resolved).
 *
 * The script body is a **constant** — it never interpolates data. The per-request cookie
 * name and dismiss key arrive as `data-*` attributes on the `<script>` element (React escapes
 * attribute values), read here via `document.currentScript`. No string-built code, so there
 * is no inline-script sanitization concern.
 */
export const ANNOUNCEMENT_NO_FLASH_SCRIPT = `(function(){
	var el = document.currentScript;
	if (!el) return;
	var cookieName = el.getAttribute("${ANNOUNCEMENT_NO_FLASH_COOKIE_ATTR}");
	var dismissKey = el.getAttribute("${ANNOUNCEMENT_NO_FLASH_KEY_ATTR}");
	if (!cookieName || !dismissKey) return;
	try {
		var prefix = cookieName + "=";
		var parts = document.cookie.split(";");
		for (var i = 0; i < parts.length; i++) {
			var part = parts[i].trim();
			if (part.indexOf(prefix) !== 0) continue;
			var raw = part.slice(prefix.length);
			var value;
			try { value = decodeURIComponent(raw); } catch (e) { value = raw; }
			if (value === dismissKey) {
				var root = document.documentElement;
				root.setAttribute("data-announcement-dismissed", "");
				root.style.setProperty("--announcement-bar-height", "0px");
				break;
			}
		}
	} catch (e) {}
})();`;
