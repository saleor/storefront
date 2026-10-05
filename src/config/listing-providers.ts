import { fixtureListingProvider } from "@/lib/listing/providers/fixture";
import { saleorListingProvider } from "@/lib/listing/providers/saleor";
import type { ListingProvider } from "@/lib/listing/provider";
import type { ListingSurfaceKind } from "@/lib/storefront/contract/listing";

/**
 * Fork-owned provider map. One provider per surface: categories can stay on
 * Saleor while search uses another backend.
 *
 * `LISTING_PROVIDER_<SURFACE>` overrides a single surface at runtime
 * (`LISTING_PROVIDER_SEARCH=fixture`). Bracket access so Next does not inline it.
 */
export const LISTING_PROVIDER_REGISTRY = {
	saleor: saleorListingProvider,
	fixture: fixtureListingProvider,
} as const satisfies Record<string, ListingProvider>;

export const LISTING_PROVIDERS = {
	all: "saleor",
	category: "saleor",
	collection: "saleor",
	search: "saleor",
} as const satisfies Record<ListingSurfaceKind, keyof typeof LISTING_PROVIDER_REGISTRY>;
