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

const UNRESOLVED_PLACEHOLDER = /\{(slug|channel)\}/;

export interface CacheProfile {
	readonly id: string;
	readonly label: string;
	/** Next.js cacheLife profile name */
	readonly cacheProfile: CacheLifeProfile;
	/** Tag pattern — use {slug} and/or {channel} placeholders */
	readonly tagPattern: string;
	/** Path pattern — use {channel} and {slug} as placeholders, or null for non-path caches */
	readonly pathPattern: string | null;
}

export type CacheTagParams = {
	slug?: string;
	channel?: string;
};

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
		tagPattern: "navigation:{channel}",
		pathPattern: null,
	},
	footerMenu: {
		id: "footer-menu",
		label: "Footer Menu",
		cacheProfile: "hours",
		tagPattern: "footer-menu:{channel}",
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

export const CACHE_PROFILE_LIST = Object.values(profiles);

function normalizeTagParams(params?: string | CacheTagParams): CacheTagParams {
	if (typeof params === "string") {
		return { slug: params };
	}
	return params ?? {};
}

export function tagPatternHasPlaceholders(pattern: string): boolean {
	return pattern.includes("{slug}") || pattern.includes("{channel}");
}

export function isGlobalTagProfile(profile: CacheProfile): boolean {
	return !tagPatternHasPlaceholders(profile.tagPattern);
}

/** Profiles tagged per channel only (e.g. navigation:{channel}, footer-menu:{channel}). */
export function isChannelScopedTagProfile(profile: CacheProfile): boolean {
	return profile.tagPattern.includes("{channel}") && !profile.tagPattern.includes("{slug}");
}

export function getChannelScopedTagProfiles(): CacheProfile[] {
	return CACHE_PROFILE_LIST.filter(isChannelScopedTagProfile);
}

function tagPatternToRegExp(pattern: string): RegExp {
	const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`^${escaped.replace("\\{slug\\}", "[^:]+").replace("\\{channel\\}", "[^:]+")}$`);
}

/**
 * Resolve the cacheLife profile for a concrete tag string (manual revalidation).
 * Falls back to "minutes" for unknown tags.
 */
export function resolveCacheLifeProfileForTag(tag: string): CacheLifeProfile {
	for (const profile of CACHE_PROFILE_LIST) {
		if (isGlobalTagProfile(profile)) {
			if (tag === profile.tagPattern) return profile.cacheProfile;
			continue;
		}
		if (tagPatternToRegExp(profile.tagPattern).test(tag)) {
			return profile.cacheProfile;
		}
	}
	return "minutes";
}

/**
 * Resolve a manual revalidation tag from profile id/shorthand + optional channel.
 *
 * @example resolveManualRevalidateTag("navigation", "default-channel") → "navigation:default-channel"
 */
export function resolveManualRevalidateTag(tag: string, channel?: string | null): string {
	if (!channel || UNRESOLVED_PLACEHOLDER.test(tag)) {
		return tag;
	}

	for (const profile of CACHE_PROFILE_LIST) {
		if (!isChannelScopedTagProfile(profile)) continue;

		const shorthand = profile.tagPattern.replace(":{channel}", "");
		if (tag === profile.id || tag === shorthand) {
			return buildTag(profile, { channel });
		}
	}

	return tag;
}

// ============================================================================
// Helpers for "use cache" functions
// ============================================================================

/**
 * Apply cacheLife + cacheTag for a profile inside a "use cache" function body.
 * Pass `slug` and/or `channel` when the profile's tagPattern contains placeholders.
 *
 * Note: TypeScript cannot resolve cacheLife's overloads when passed a union
 * type, so we cast through `string`. This is safe because CacheLifeProfile
 * only contains valid Next.js built-in profile names.
 */
export function applyCacheProfile(profile: CacheProfile, params?: string | CacheTagParams) {
	(cacheLife as (p: string) => void)(profile.cacheProfile);
	cacheTag(buildTag(profile, params));
}

// ============================================================================
// Tag / path builders — used by the revalidation endpoint
// ============================================================================

export function buildTag(profile: CacheProfile, params?: string | CacheTagParams): string {
	const { slug, channel } = normalizeTagParams(params);
	let tag = profile.tagPattern;
	if (slug) tag = tag.replaceAll("{slug}", slug);
	if (channel) tag = tag.replaceAll("{channel}", channel);

	if (UNRESOLVED_PLACEHOLDER.test(tag)) {
		const missing = (["{slug}", "{channel}"] as const).filter((placeholder) => tag.includes(placeholder));
		throw new Error(
			`[cache-manifest] Unresolved tag "${tag}" for profile "${profile.id}". ` +
				`Provide: ${missing.join(", ")}`,
		);
	}

	return tag;
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

const MANIFEST_VERSION = 2;

export function buildManifest() {
	return {
		version: MANIFEST_VERSION,
		profiles: CACHE_PROFILE_LIST.map((p) => ({
			id: p.id,
			label: p.label,
			cacheProfile: p.cacheProfile,
			tagPattern: p.tagPattern,
			pathPattern: p.pathPattern,
		})),
	};
}
