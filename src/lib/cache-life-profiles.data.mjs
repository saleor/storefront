/** @typedef {{ stale: number; revalidate: number; expire: number }} CacheLifeTier */

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Custom cacheLife profiles for Paper — single source for next.config.js and TypeScript.
 * @type {Record<"catalog" | "menus" | "channels", CacheLifeTier>}
 */
export const paperCacheLifeProfiles = {
	// Webhook invalidation (PRODUCT_*, CATEGORY_*, COLLECTION_*) is the primary freshness
	// mechanism for catalog data, so `revalidate` is only the backstop for a webhook that
	// was never configured or was dropped. A 1-minute backstop meant every catalog entry
	// regenerated ~1440x/day regardless of traffic; an hour keeps the safety net without
	// paying for it continuously.
	catalog: {
		stale: 5 * MINUTE,
		revalidate: 1 * HOUR,
		expire: 1 * DAY,
	},
	menus: {
		stale: 5 * MINUTE,
		revalidate: 1 * HOUR,
		expire: 1 * DAY,
	},
	channels: {
		stale: 5 * MINUTE,
		revalidate: 1 * DAY,
		expire: 1 * WEEK,
	},
};
