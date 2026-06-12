import { cacheLife, cacheTag } from "next/cache";
import { localeConfig } from "@/config/locale";
import {
	isStorefrontContentPageSlug,
	resolveStorefrontContentChannelsForPageSlug,
} from "@/lib/content/constants";
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

const UNRESOLVED_PLACEHOLDER = /\{(slug|channel|locale)\}/;

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
	/** BCP 47 locale — storefront content cache key (Saleor translations not wired yet). */
	locale?: string;
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
	pages: {
		id: "pages",
		label: "CMS Pages",
		cacheProfile: "catalog",
		tagPattern: "page:{slug}",
		pathPattern: "/{channel}/pages/{slug}",
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
	storefrontContent: {
		id: "storefront-content",
		label: "Storefront Content",
		cacheProfile: "menus",
		tagPattern: "storefront-content:{channel}:{locale}",
		pathPattern: "/{channel}",
	},
} as const satisfies Record<string, CacheProfile>;

export const CACHE_PROFILES = profiles;

export const CACHE_PROFILE_LIST = Object.values(profiles);

/** Saleor menu slugs used by cached layout components — keep in sync with saleor-paper-app storefront-menus.ts */
export const NAVBAR_MENU_SLUG = "navbar" as const;
export const FOOTER_MENU_SLUG = "footer" as const;

/** Saleor menu slugs fetched by the storefront → cache profile for invalidation. */
export const STOREFRONT_MENU_SLUGS = {
	[NAVBAR_MENU_SLUG]: profiles.navigation,
	[FOOTER_MENU_SLUG]: profiles.footerMenu,
} as const satisfies Record<string, CacheProfile>;

export type StorefrontMenuSlug = keyof typeof STOREFRONT_MENU_SLUGS;

export function resolveCacheProfileForMenuSlug(menuSlug: string): CacheProfile | null {
	if (!isKnownStorefrontMenuSlug(menuSlug)) return null;
	return STOREFRONT_MENU_SLUGS[menuSlug];
}

export function isKnownStorefrontMenuSlug(menuSlug: string): menuSlug is StorefrontMenuSlug {
	return menuSlug in STOREFRONT_MENU_SLUGS;
}

/** Extract menu slug from a Saleor menu or menu-item webhook payload. */
export function extractMenuSlugFromWebhookPayload(payload: unknown): string | null {
	if (!payload || typeof payload !== "object") return null;

	const data = payload as Record<string, unknown>;

	if (data.menu && typeof data.menu === "object") {
		const slug = (data.menu as Record<string, unknown>).slug;
		if (typeof slug === "string" && slug.length > 0) return slug;
	}

	if (data.menuItem && typeof data.menuItem === "object") {
		const menu = (data.menuItem as Record<string, unknown>).menu;
		if (menu && typeof menu === "object") {
			const slug = (menu as Record<string, unknown>).slug;
			if (typeof slug === "string" && slug.length > 0) return slug;
		}
	}

	return null;
}

/** Extract page slug from a Saleor page webhook payload. */
export function extractPageSlugFromWebhookPayload(payload: unknown): string | null {
	if (!payload || typeof payload !== "object") return null;

	const data = payload as Record<string, unknown>;

	if (data.page && typeof data.page === "object") {
		const slug = (data.page as Record<string, unknown>).slug;
		if (typeof slug === "string" && slug.length > 0) return slug;
	}

	return null;
}

/** Build channel-scoped menu tags for every storefront channel. */
export function buildMenuRevalidationTags(
	menuSlug: string,
	channels: readonly string[],
): Array<{ tag: string; profile: CacheLifeProfile }> {
	const profile = resolveCacheProfileForMenuSlug(menuSlug);
	if (!profile || channels.length === 0) return [];

	return channels.map((channel) => ({
		tag: buildTag(profile, { channel }),
		profile: profile.cacheProfile,
	}));
}

export type MenuRevalidationPlan =
	| { action: "revalidate"; menuSlug: string; tags: Array<{ tag: string; profile: CacheLifeProfile }> }
	| { action: "skip"; reason: "missing_slug" | "unknown_menu" }
	| { action: "error"; reason: "no_channels" };

/** Pure planner for menu webhook invalidation — keeps route handler thin and testable. */
export function planMenuRevalidation(
	menuSlug: string | undefined,
	channels: readonly string[],
): MenuRevalidationPlan {
	if (!menuSlug) return { action: "skip", reason: "missing_slug" };
	if (channels.length === 0) return { action: "error", reason: "no_channels" };

	const tags = buildMenuRevalidationTags(menuSlug, channels);
	if (tags.length === 0) return { action: "skip", reason: "unknown_menu" };

	return { action: "revalidate", menuSlug, tags };
}

export type PageRevalidationPlan =
	| { action: "revalidate"; slug: string; tag: string; profile: CacheLifeProfile; paths: string[] }
	| { action: "skip"; reason: "missing_slug" }
	| { action: "error"; reason: "no_channels" };

/** Plan CMS page invalidation — tag is slug-scoped; paths are per storefront channel. */
export function planPageRevalidation(
	slug: string | undefined,
	channels: readonly string[],
	fallbackChannel?: string | null,
): PageRevalidationPlan {
	if (!slug) return { action: "skip", reason: "missing_slug" };

	const channelList = channels.length > 0 ? channels : fallbackChannel ? [fallbackChannel] : [];
	if (channelList.length === 0) return { action: "error", reason: "no_channels" };

	const paths = channelList
		.map((channel) => buildPath(CACHE_PROFILES.pages, channel, slug))
		.filter((path): path is string => path !== null);

	return {
		action: "revalidate",
		slug,
		tag: buildTag(CACHE_PROFILES.pages, slug),
		profile: CACHE_PROFILES.pages.cacheProfile,
		paths,
	};
}

export type StorefrontContentRevalidationPlan =
	| {
			action: "revalidate";
			tags: Array<{ tag: string; profile: CacheLifeProfile }>;
			paths: string[];
	  }
	| { action: "skip"; reason: "not_storefront_singleton" | "no_channels" };

/**
 * Plan invalidation for Saleor `storefront-*` singleton pages (`default`, `default-{channel}`).
 * Merges with editorial CMS page revalidation in the webhook handler.
 */
export function planStorefrontContentRevalidation(
	pageSlug: string | undefined,
	channels: readonly string[],
	fallbackChannel?: string | null,
): StorefrontContentRevalidationPlan {
	if (!pageSlug || !isStorefrontContentPageSlug(pageSlug)) {
		return { action: "skip", reason: "not_storefront_singleton" };
	}

	const channelList = channels.length > 0 ? channels : fallbackChannel ? [fallbackChannel] : [];
	if (channelList.length === 0) return { action: "skip", reason: "no_channels" };

	const targetChannels = resolveStorefrontContentChannelsForPageSlug(pageSlug, channelList);
	if (targetChannels.length === 0) {
		return { action: "skip", reason: "not_storefront_singleton" };
	}

	const profile = CACHE_PROFILES.storefrontContent;

	return {
		action: "revalidate",
		tags: targetChannels.flatMap((channel) =>
			buildStorefrontContentCacheTags(channel).map((tag) => ({
				tag,
				profile: profile.cacheProfile,
			})),
		),
		paths: targetChannels
			.map((channel) => buildPath(profile, channel))
			.filter((path): path is string => path !== null),
	};
}

/** All locale cache tags for storefront marketing copy on a channel. */
export function buildStorefrontContentCacheTags(channel: string): string[] {
	return localeConfig.available.map((locale) =>
		buildTag(CACHE_PROFILES.storefrontContent, { channel, locale }),
	);
}

function normalizeTagParams(params?: string | CacheTagParams): CacheTagParams {
	if (typeof params === "string") {
		return { slug: params };
	}
	return params ?? {};
}

export function tagPatternHasPlaceholders(pattern: string): boolean {
	return pattern.includes("{slug}") || pattern.includes("{channel}") || pattern.includes("{locale}");
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
	return new RegExp(
		`^${escaped
			.replace("\\{slug\\}", "[^:]+")
			.replace("\\{channel\\}", "[^:]+")
			.replace("\\{locale\\}", "[^:]+")}$`,
	);
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
	const { slug, channel, locale } = normalizeTagParams(params);
	let tag = profile.tagPattern;
	if (slug) tag = tag.replaceAll("{slug}", slug);
	if (channel) tag = tag.replaceAll("{channel}", channel);
	if (locale) tag = tag.replaceAll("{locale}", locale);

	if (UNRESOLVED_PLACEHOLDER.test(tag)) {
		const missing = (["{slug}", "{channel}", "{locale}"] as const).filter((placeholder) =>
			tag.includes(placeholder),
		);
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
