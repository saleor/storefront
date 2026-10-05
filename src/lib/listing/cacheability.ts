import type { ListingQuery } from "@/lib/storefront/contract/listing";

/**
 * True when a listing is safe to cache.
 * Filters, cursors, offset pages, and search are the long tail and stay live.
 * Sort-only is cacheable: it is part of the cache key, not a new filter space.
 */
export function isCacheableListingQuery(query: ListingQuery): boolean {
	if (query.surface.kind === "search") return false;
	if (query.page.mode === "offset" && query.page.number > 1) return false;
	if (query.page.mode === "cursor" && (query.page.cursor || query.page.direction === "prev")) return false;
	if (Object.values(query.selections).some((values) => values.length > 0)) return false;
	if (query.range && Object.keys(query.range).length > 0) return false;
	return true;
}
