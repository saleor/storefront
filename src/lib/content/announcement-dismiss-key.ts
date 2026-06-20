import type { AnnouncementBarContent } from "@/lib/content/types";

const DISMISS_PREFIX = "paper:announcement-dismissed";

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
 * `localStorage` key for a dismissed announcement bar.
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
