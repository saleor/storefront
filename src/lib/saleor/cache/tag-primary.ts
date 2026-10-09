import { cacheTag } from "next/cache";
import { buildTag, type CacheProfile } from "./manifest";

/**
 * When a page was fetched via a translated URL slug, also tag the entry with the
 * primary slug so PRODUCT_/CATEGORY_/… webhooks (which carry the primary slug) bust
 * the `"use cache"` payload.
 */
export function tagPrimaryCatalogSlug(profile: CacheProfile, urlSlug: string, primarySlug: string) {
	if (urlSlug === primarySlug) return;
	cacheTag(buildTag(profile, primarySlug));
}

/** Tag one slug even when it is the only handle (category slug → id lookups). */
export function tagCatalogSlug(profile: CacheProfile, slug: string) {
	cacheTag(buildTag(profile, slug));
}
