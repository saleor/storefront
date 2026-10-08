import "server-only";

import { LISTING_PROVIDER_REGISTRY, LISTING_PROVIDERS } from "@/config/listing-providers";
import type { ListingSurfaceKind } from "@/lib/storefront/contract/listing";
import { assertProviderSupportsSurface, type ListingProvider } from "@/lib/listing/provider";

const SURFACE_KINDS: readonly ListingSurfaceKind[] = ["all", "category", "collection", "search"];

/**
 * `LISTING_PROVIDER_<SURFACE>` swaps one surface for local runs, tests, and previews.
 * Production on Vercel ignores it: the provider map in `src/config/listing-providers.ts`
 * is the reviewed choice, and a stray env var must not serve fixture products.
 */
export function resolveListingProviderId(kind: ListingSurfaceKind): string {
	const configured = LISTING_PROVIDERS[kind];
	const envName = `LISTING_PROVIDER_${kind.toUpperCase()}`;
	const override = process.env[envName]?.trim().toLowerCase();
	if (!override) return configured;
	if (process.env["VERCEL_ENV"] === "production") {
		if (override !== configured) {
			console.warn(`[listing] Ignoring ${envName}="${override}" on Vercel production; using ${configured}.`);
		}
		return configured;
	}
	if (override in LISTING_PROVIDER_REGISTRY) return override;
	console.warn(`[listing] Unknown ${envName}="${override}"; using ${configured}.`);
	return configured;
}

export function getListingProvider(id: string): ListingProvider {
	const registry: Record<string, ListingProvider> = LISTING_PROVIDER_REGISTRY;
	const provider = registry[id];
	if (!provider) {
		throw new Error(
			`[listing] Unknown listing provider "${id}". Register it in src/config/listing-providers.ts.`,
		);
	}
	return provider;
}

export function listingProviderFor(kind: ListingSurfaceKind): ListingProvider {
	const provider = getListingProvider(resolveListingProviderId(kind));
	assertProviderSupportsSurface(provider, kind);
	return provider;
}

/** Fail at startup when a surface points at a provider that cannot serve it. */
export function assertListingProviders(): void {
	for (const kind of SURFACE_KINDS) listingProviderFor(kind);
}
