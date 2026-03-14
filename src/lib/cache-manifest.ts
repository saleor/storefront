import { cacheLife, cacheTag } from "next/cache";

// ============================================================================
// Cache Profile Definitions — single source of truth
//
// Imported by:
//   - Cached functions (for cacheLife/cacheTag calls)
//   - Revalidation endpoint (for tag/path construction)
//   - /api/cache-info (to serve the manifest to the dashboard app)
// ============================================================================

type CacheLifeProfile = "default" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "max";

interface CacheProfile {
	readonly id: string;
	readonly label: string;
	/** Next.js cacheLife profile name */
	readonly cacheProfile: CacheLifeProfile;
	/** Tag pattern — use {slug} as a placeholder for dynamic segments */
	readonly tagPattern: string;
	/** Path pattern — use {channel} and {slug} as placeholders, or null for non-path caches */
	readonly pathPattern: string | null;
}

const profiles = {
	products: {
		id: "products",
		label: "Product Pages",
		cacheProfile: "minutes",
		tagPattern: "product:{slug}",
		pathPattern: "/{channel}/products/{slug}",
	},
	categories: {
		id: "categories",
		label: "Category Pages",
		cacheProfile: "minutes",
		tagPattern: "category:{slug}",
		pathPattern: "/{channel}/categories/{slug}",
	},
	collections: {
		id: "collections",
		label: "Collection Pages",
		cacheProfile: "minutes",
		tagPattern: "collection:{slug}",
		pathPattern: "/{channel}/collections/{slug}",
	},
	navigation: {
		id: "navigation",
		label: "Navigation Menus",
		cacheProfile: "hours",
		tagPattern: "navigation",
		pathPattern: null,
	},
	footerMenu: {
		id: "footer-menu",
		label: "Footer Menu",
		cacheProfile: "hours",
		tagPattern: "footer-menu",
		pathPattern: null,
	},
	channels: {
		id: "channels",
		label: "Channel List",
		cacheProfile: "days",
		tagPattern: "channels",
		pathPattern: null,
	},
} as const satisfies Record<string, CacheProfile>;

export const CACHE_PROFILES = profiles;

// ============================================================================
// Helpers for "use cache" functions
// ============================================================================

/**
 * Apply cacheLife + cacheTag for a profile inside a "use cache" function body.
 * Pass `slug` when the profile's tagPattern contains a {slug} placeholder.
 *
 * Note: TypeScript cannot resolve cacheLife's overloads when passed a union
 * type, so we cast through `string`. This is safe because CacheLifeProfile
 * only contains valid Next.js built-in profile names.
 */
export function applyCacheProfile(profile: CacheProfile, slug?: string) {
	(cacheLife as (p: string) => void)(profile.cacheProfile);
	cacheTag(slug ? profile.tagPattern.replace("{slug}", slug) : profile.tagPattern);
}

// ============================================================================
// Tag / path builders — used by the revalidation endpoint
// ============================================================================

export function buildTag(profile: CacheProfile, slug?: string): string {
	return slug ? profile.tagPattern.replace("{slug}", slug) : profile.tagPattern;
}

export function buildPath(profile: CacheProfile, channel: string, slug?: string): string | null {
	if (!profile.pathPattern) return null;
	let path = profile.pathPattern.replace("{channel}", channel);
	if (slug) path = path.replace("{slug}", slug);
	return path;
}

// ============================================================================
// Manifest for /api/cache-info
// ============================================================================

const MANIFEST_VERSION = 1;

export function buildManifest() {
	return {
		version: MANIFEST_VERSION,
		profiles: Object.values(profiles).map((p) => ({
			id: p.id,
			label: p.label,
			cacheProfile: p.cacheProfile,
			tagPattern: p.tagPattern,
			pathPattern: p.pathPattern,
		})),
	};
}
