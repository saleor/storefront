import { cacheTag } from "next/cache";
import { type CacheProfile, buildTag } from "@/lib/cache-manifest";

/**
 * When a page was fetched via a translated URL slug, also tag the entry with the
 * primary slug so PRODUCT_/CATEGORY_/… webhooks (which carry the primary slug) bust cache.
 */
export function tagPrimaryCatalogSlug(profile: CacheProfile, urlSlug: string, primarySlug: string) {
	if (urlSlug === primarySlug) return;
	cacheTag(buildTag(profile, primarySlug));
}
