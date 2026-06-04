import { cacheLife, cacheTag } from "next/cache";
import {
	DEFAULT_PAPER_CACHE_LIFE_PROFILE,
	type PaperCacheLifeProfile,
	paperCacheLifeProfileDocs,
	resolveRevalidateCacheLifeProfile,
} from "@/lib/cache-life-profiles";

// ============================================================================
// Cache Profile Definitions — single source of truth
//
// **cacheLife profile names** live in src/lib/cache-life-profiles.ts (with docs).
// This file maps Saleor cache *tags* to those profiles and builds invalidation paths.
//
// Imported by:
//   - Cached functions (applyCacheProfile → cacheLife + cacheTag)
//   - Revalidation endpoint (revalidateTag tag + profile)
//   - /api/cache-info (manifest for dashboard)
// ============================================================================

const UNRESOLVED_PLACEHOLDER = /\{(slug|channel)\}/;

export type CacheLifeProfile = PaperCacheLifeProfile;

export interface CacheProfile {
	readonly id: string;
	readonly label: string;
	/** Paper cacheLife tier — see src/lib/cache-life-profiles.ts */
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
		cacheProfile: "catalog",
		tagPattern: "product:{slug}",
		pathPattern: "/{channel}/products/{slug}",
	},
	categories: {
		id: "categories",
		label: "Category Pages",
		cacheProfile: "catalog",
		tagPattern: "category:{slug}",
		pathPattern: "/{channel}/categories/{slug}",
	},
	collections: {
		id: "collections",
		label: "Collection Pages",
		cacheProfile: "catalog",
		tagPattern: "collection:{slug}",
		pathPattern: "/{channel}/collections/{slug}",
	},
	navigation: {
		id: "navigation",
		label: "Navigation Menus",
		cacheProfile: "menus",
		tagPattern: "navigation:{channel}",
		pathPattern: null,
	},
	footerMenu: {
		id: "footer-menu",
		label: "Footer Menu",
		cacheProfile: "menus",
		tagPattern: "footer-menu:{channel}",
		pathPattern: null,
	},
	channels: {
		id: "channels",
		label: "Channel List",
		cacheProfile: "channels",
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
 * Falls back to catalog tier for unknown tags.
 */
export function resolveCacheLifeProfileForTag(tag: string): CacheLifeProfile {
	return resolveRevalidateCacheLifeProfile(tag, null, resolveCacheLifeProfileForTagFromManifest);
}

function resolveCacheLifeProfileForTagFromManifest(tag: string): CacheLifeProfile {
	for (const profile of CACHE_PROFILE_LIST) {
		if (isGlobalTagProfile(profile)) {
			if (tag === profile.tagPattern) return profile.cacheProfile;
			continue;
		}
		if (tagPatternToRegExp(profile.tagPattern).test(tag)) {
			return profile.cacheProfile;
		}
	}
	return DEFAULT_PAPER_CACHE_LIFE_PROFILE;
}

/** @internal Exported for revalidate route profile override resolution. */
export function resolveRevalidateProfileForTag(
	tag: string,
	profileOverride: string | null | undefined,
): CacheLifeProfile {
	return resolveRevalidateCacheLifeProfile(tag, profileOverride, resolveCacheLifeProfileForTagFromManifest);
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
 * Profile timings are defined in src/lib/cache-life-profiles.ts (registered in next.config.js).
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

const MANIFEST_VERSION = 3;

export function buildManifest() {
	return {
		version: MANIFEST_VERSION,
		cacheLifeTiers: paperCacheLifeProfileDocs,
		profiles: CACHE_PROFILE_LIST.map((p) => ({
			id: p.id,
			label: p.label,
			cacheProfile: p.cacheProfile,
			tagPattern: p.tagPattern,
			pathPattern: p.pathPattern,
		})),
	};
}
