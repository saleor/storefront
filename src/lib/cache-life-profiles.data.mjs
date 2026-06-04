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
	catalog: {
		stale: 5 * MINUTE,
		revalidate: 1 * MINUTE,
		expire: 1 * HOUR,
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
