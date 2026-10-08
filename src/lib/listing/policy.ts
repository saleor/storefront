import "server-only";

import { applyListingTtl } from "@/lib/saleor";
import type { ListingQuery, ListingResult } from "@/lib/storefront/contract/listing";
import { isCacheableListingQuery } from "@/lib/listing/cacheability";
import { getListingProvider, listingProviderFor } from "@/lib/listing/registry";
import { normalizeListingQuery, type ListingProvider } from "@/lib/listing/provider";

export { isCacheableListingQuery } from "@/lib/listing/cacheability";

/** Which cache wrapper `loadListing` will use. Search and filtered queries are always live. */
export function listingFetchMode(
	query: ListingQuery,
	provider: ListingProvider,
): "cached-saleor" | "cached-ttl" | "live" {
	if (!isCacheableListingQuery(query)) return "live";
	return provider.freshness.kind === "ttl" ? "cached-ttl" : "cached-saleor";
}

async function loadCachedSaleor(providerId: string, query: ListingQuery): Promise<ListingResult | null> {
	"use cache";
	return getListingProvider(providerId).load(query);
}

async function loadCachedTtl(providerId: string, query: ListingQuery): Promise<ListingResult | null> {
	"use cache";
	applyListingTtl();
	return getListingProvider(providerId).load(query);
}

/**
 * Listing data for one query. The provider is chosen from the surface.
 * The query is normalized to the provider's sorts and pagination before the cache key.
 * Canonical category, collection, and all-products grids are cached.
 * Search, filters, and cursors are live so a provider cannot explode the cache key space.
 */
export async function loadListing(input: ListingQuery): Promise<ListingResult | null> {
	const provider = listingProviderFor(input.surface.kind);
	const query = normalizeListingQuery(provider, input);
	const mode = listingFetchMode(query, provider);
	if (mode === "cached-saleor") return loadCachedSaleor(provider.id, query);
	if (mode === "cached-ttl") return loadCachedTtl(provider.id, query);
	return provider.load(query);
}
