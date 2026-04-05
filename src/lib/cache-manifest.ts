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

interface PageConfig {
	readonly id: string;
	readonly label: string;
	/** Path pattern — use {channel} as placeholder */
	readonly pathPattern: string;
	/** Tags this page depends on — when any of these are invalidated, also invalidate this page */
	readonly dependencies: readonly string[];
	/** Optional tag for manual invalidation of this specific page */
	readonly tag?: string;
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
// Special Pages — pages with explicit dependencies on cache tags
//
// When a dependency tag is invalidated (e.g., "collection:featured-products"),
// the revalidation endpoint will also revalidate the paths of dependent pages.
// ============================================================================

const pages = {
	homepage: {
		id: "homepage",
		label: "Homepage",
		pathPattern: "/{channel}",
		dependencies: ["collection:featured-products"],
		tag: "page:homepage",
	},
} as const satisfies Record<string, PageConfig>;

export const CACHE_PAGES = pages;

// ============================================================================
// Validation — run at module load to catch configuration errors early
// ============================================================================

function validatePageDependencies() {
	const profilePatterns = Object.values(profiles).map((p) => p.tagPattern as string);
	const dynamicPrefixes = Object.values(profiles)
		.filter((p) => p.tagPattern.includes("{slug}"))
		.map((p) => p.tagPattern.replace("{slug}", "").replace(/:$/, ""));

	for (const [pageId, page] of Object.entries(pages)) {
		for (const dep of page.dependencies) {
			if (dep.includes("{") || dep.includes("}")) {
				throw new Error(
					`[cache-manifest] Invalid dependency "${dep}" in page "${pageId}". ` +
						'Dependencies must be concrete tags (e.g., "collection:featured-products"), not placeholders.',
				);
			}

			if (dep.startsWith("page:")) {
				throw new Error(
					`[cache-manifest] Page "${pageId}" depends on "${dep}". ` +
						`Pages cannot depend on other pages' tags — only on data-source tags like "collection:*".`,
				);
			}

			const isFixedTag = profilePatterns.includes(dep);
			const isDynamicTag = dynamicPrefixes.some((prefix) => dep.startsWith(`${prefix}:`));

			if (!isFixedTag && !isDynamicTag) {
				throw new Error(
					`[cache-manifest] Invalid dependency "${dep}" in page "${pageId}". ` +
						`Dependencies must reference profile tags (e.g., "collection:featured-products", "navigation"). ` +
						`Valid patterns: ${profilePatterns.join(", ")}`,
				);
			}
		}
	}
}

validatePageDependencies();

// ============================================================================
// Helpers for "use cache" functions
// ============================================================================

// NOTE: Common/shared tags like "all" don't work in Next.js 16 Cache Components.
// Only the FIRST cacheTag() call per entry is registered for invalidation.
// We use specific tags (like "product:white-plimsolls") for per-item invalidation,
// and revalidatePath("/", "layout") for broad purges.

/**
 * Apply cacheLife + cacheTag for a profile inside a "use cache" function body.
 * Pass `slug` when the profile's tagPattern contains a {slug} placeholder.
 *
 * Emits a single tag: the resolved pattern (e.g. `product:blue-shirt` or `navigation`).
 * Next.js 16 Cache Components only honor the first `cacheTag()` per entry for
 * `revalidateTag`; this codebase invalidates via `revalidatePath` instead.
 *
 * Note: TypeScript cannot resolve cacheLife's overloads when passed a union
 * type, so we cast through `string`. This is safe because CacheLifeProfile
 * only contains valid Next.js built-in profile names.
 */
export function applyCacheProfile(profile: CacheProfile, slug?: string) {
	(cacheLife as (p: string) => void)(profile.cacheProfile);
	// IMPORTANT: Next.js 16 only registers the FIRST cacheTag() call for invalidation.
	// We use the specific tag (e.g., "product:white-plimsolls") to enable per-item
	// invalidation via webhooks. Broad purges use revalidatePath("/", "layout") instead.
	const specificTag = slug ? profile.tagPattern.replace("{slug}", slug) : profile.tagPattern;
	cacheTag(specificTag);
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
// Page dependency helpers — used by the revalidation endpoint
// ============================================================================

/**
 * Find all pages that depend on a given tag.
 * Call this after invalidating a tag to get additional paths to revalidate.
 */
export function findDependentPages(tag: string): PageConfig[] {
	return Object.values(pages).filter((page) => page.dependencies.includes(tag));
}

/**
 * Build the path for a page config.
 */
export function buildPagePath(page: PageConfig, channel: string): string {
	return page.pathPattern.replace("{channel}", channel);
}

/**
 * Find a page by its optional manual invalidation tag.
 */
export function findPageByTag(tag: string): PageConfig | undefined {
	return Object.values(pages).find((page) => page.tag === tag);
}

// ============================================================================
// Manifest for /api/cache-info
// ============================================================================

const MANIFEST_VERSION = 2;

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
		pages: Object.values(pages).map((p) => ({
			id: p.id,
			label: p.label,
			pathPattern: p.pathPattern,
			dependencies: p.dependencies,
			tag: p.tag,
		})),
	};
}
