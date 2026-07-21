import { cacheTag } from "next/cache";
import { type CacheProfile, buildTag } from "@/lib/cache-manifest";

/**
 * When a page was fetched via a translated URL slug, also tag the entry with the
 * primary slug so PRODUCT_/CATEGORY_/… webhooks (which carry the primary slug) bust
 * the `"use cache"` payload. Path fan-out in `/api/revalidate` still uses the primary
 * slug only — translated URL route shells rely on tag invalidation (+ TTL) until
 * paper-app can forward per-locale handles (ADR 0004 phase 3).
 */
export function tagPrimaryCatalogSlug(profile: CacheProfile, urlSlug: string, primarySlug: string) {
	if (urlSlug === primarySlug) return;
	cacheTag(buildTag(profile, primarySlug));
}
