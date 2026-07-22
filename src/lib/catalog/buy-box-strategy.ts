import { EXTERNAL_BUYBOX_PRODUCT_TYPE_SLUGS, PDP_VARIANT_CAP } from "@/config/variants";

/**
 * Page-level PDP buy-box strategy.
 *
 * - `matrix` — hydrate the attribute picker (under {@link PDP_VARIANT_CAP}).
 * - `over_budget` — skip the matrix; ATC only via `?variant=` / `?sku=` deep link.
 * - `external` — product-type opt-in for a fork-supplied picker (seat map, CPQ, …);
 *   still supports the same deep-link ATC contract. `guided` is deferred.
 *
 * Resolve only inside dynamic islands — never in the static product shell (PPR).
 */
export type BuyBoxStrategy = "matrix" | "over_budget" | "external";

export function resolveBuyBoxStrategy(input: {
	totalCount: number | null | undefined;
	productTypeSlug?: string | null;
	/** Override for tests; defaults to {@link EXTERNAL_BUYBOX_PRODUCT_TYPE_SLUGS}. */
	externalProductTypeSlugs?: readonly string[];
}): BuyBoxStrategy {
	const typeSlug = input.productTypeSlug?.trim().toLowerCase();
	const externalSlugs = input.externalProductTypeSlugs ?? EXTERNAL_BUYBOX_PRODUCT_TYPE_SLUGS;
	if (typeSlug && externalSlugs.some((s) => s.toLowerCase() === typeSlug)) {
		return "external";
	}

	if (input.totalCount != null && input.totalCount > PDP_VARIANT_CAP) {
		return "over_budget";
	}

	return "matrix";
}

/**
 * Public deep-link contract for the PDP buy box / gallery islands.
 *
 * - `?variant=<Saleor global id>` — preferred
 * - `?sku=<variant sku>` — supported when the id is unknown (feeds, emails, POS)
 * - When both are present, `variant` wins
 */
export type PdpVariantDeepLink = { kind: "id"; id: string } | { kind: "sku"; sku: string };

export function resolvePdpVariantDeepLink(params: {
	variant?: string | null;
	sku?: string | null;
}): PdpVariantDeepLink | null {
	const variantId = params.variant?.trim();
	if (variantId) return { kind: "id", id: variantId };

	const sku = params.sku?.trim();
	if (sku) return { kind: "sku", sku };

	return null;
}
