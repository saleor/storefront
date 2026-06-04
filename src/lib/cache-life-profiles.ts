/**
 * Paper storefront — cacheLife profile definitions
 *
 * ## What this is
 *
 * Next.js `"use cache"` functions call `cacheLife(name)` to set how long cached
 * data lives. These names are **custom profiles** declared in `next.config.js`
 * (via `paperCacheLifeProfiles` below) and referenced from `cache-manifest.ts`.
 *
 * ## You usually do NOT touch this file
 *
 * - **Fresh data on publish?** Configure Saleor webhooks → `/api/revalidate`
 *   (instant invalidation via `cacheTag`, regardless of TTL).
 * - **Cart/checkout prices?** Always live (`cache: "no-cache"`) — not affected here.
 *
 * Change timings here only when you intentionally want different **fallback**
 * TTLs (e.g. slower background refresh when webhooks are missing).
 *
 * ## The three timers (plain English)
 *
 * | Field        | Who cares | What it means |
 * | ------------ | --------- | ------------- |
 * | `stale`      | Browser   | How long the client shows cached HTML/data without asking the server again. |
 * | `revalidate` | Server    | After this, the **next request** refreshes data in the background (user may still see old content briefly). |
 * | `expire`     | Server    | If nobody visits for this long, the **next** visitor waits for a fresh fetch. |
 *
 * Webhook `revalidateTag(tag, profile)` clears a tag immediately — these timers
 * are the safety net when no webhook fires.
 *
 * ## Profiles (tiers)
 *
 * | Profile   | Used for                         | Same as built-in |
 * | --------- | -------------------------------- | ---------------- |
 * | `catalog` | Products, categories, collections, homepage featured | `minutes` |
 * | `menus`   | Header nav, footer menu          | `hours`   |
 * | `channels`| Footer channel metadata list     | `days`    |
 *
 * Values intentionally match Next.js preset profiles so behaviour stays the same
 * after switching from generic `"minutes"` / `"hours"` / `"days"` names.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/cacheLife
 * @see src/lib/cache-manifest.ts — maps each cache tag to a profile
 */

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/** Profile names registered in `next.config.js` → `cacheLife`. */
export type PaperCacheLifeProfile = "catalog" | "menus" | "channels";

/** Seconds-based config passed to Next.js `cacheLife` in next.config.js. */
export type PaperCacheLifeConfig = Record<
	PaperCacheLifeProfile,
	{ stale: number; revalidate: number; expire: number }
>;

/**
 * Custom cacheLife profiles for Paper.
 * Imported by `next.config.js` — keep in sync with `CACHE_PROFILES` in cache-manifest.
 */
export const paperCacheLifeProfiles: PaperCacheLifeConfig = {
	/** Saleor catalog content — PDP, PLP, collections, homepage featured. */
	catalog: {
		stale: 5 * MINUTE,
		revalidate: 1 * MINUTE,
		expire: 1 * HOUR,
	},
	/** Navigation menus — change rarely; webhook invalidation is primary. */
	menus: {
		stale: 5 * MINUTE,
		revalidate: 1 * HOUR,
		expire: 1 * DAY,
	},
	/** Channel list metadata — changes very rarely. */
	channels: {
		stale: 5 * MINUTE,
		revalidate: 1 * DAY,
		expire: 1 * WEEK,
	},
};

/** Default profile when a tag is not in the manifest (conservative catalog tier). */
export const DEFAULT_PAPER_CACHE_LIFE_PROFILE: PaperCacheLifeProfile = "catalog";

/** All tier names registered in next.config.js — use for validation/tests. */
export const PAPER_CACHE_LIFE_PROFILE_NAMES = Object.keys(paperCacheLifeProfiles) as PaperCacheLifeProfile[];

/** Built-in Next.js preset names → Paper tiers (manual revalidation backward compat). */
const LEGACY_PROFILE_ALIASES: Record<string, PaperCacheLifeProfile> = {
	minutes: "catalog",
	hours: "menus",
	days: "channels",
};

export function isPaperCacheLifeProfile(value: string): value is PaperCacheLifeProfile {
	return value in paperCacheLifeProfiles;
}

/**
 * Resolve the cacheLife profile for revalidateTag(tag, profile).
 * Profile must match the tier used in cacheLife() when the entry was cached.
 */
export function resolveRevalidateCacheLifeProfile(
	tag: string,
	override: string | null | undefined,
	resolveFromTag: (tag: string) => PaperCacheLifeProfile,
): PaperCacheLifeProfile {
	if (override) {
		if (isPaperCacheLifeProfile(override)) {
			return override;
		}
		const legacy = LEGACY_PROFILE_ALIASES[override];
		if (legacy) {
			return legacy;
		}
		console.warn(`[cache-life] Unknown profile override "${override}" — resolving from tag "${tag}" instead`);
	}
	return resolveFromTag(tag);
}

/** Human-readable summary for `/api/cache-info` and debugging. */
export const paperCacheLifeProfileDocs: Record<
	PaperCacheLifeProfile,
	{ label: string; usedFor: string; stale: string; revalidate: string; expire: string }
> = {
	catalog: {
		label: "Catalog",
		usedFor: "Products, categories, collections, homepage featured",
		stale: "5 min",
		revalidate: "1 min",
		expire: "1 hour",
	},
	menus: {
		label: "Menus",
		usedFor: "Header navigation, footer menu",
		stale: "5 min",
		revalidate: "1 hour",
		expire: "1 day",
	},
	channels: {
		label: "Channels",
		usedFor: "Footer channel selector metadata",
		stale: "5 min",
		revalidate: "1 day",
		expire: "1 week",
	},
};
