/**
 * Variant / attribute-picker budgets for high-cardinality catalogs.
 *
 * Single source of truth for PDP/PLP caps and per-group control thresholds.
 * Override in a fork by editing this file — do not scatter magic numbers in queries/UI.
 *
 * Stock freshness: PDP variant payloads (incl. `quantityAvailable`) use the same
 * `product:{slug}` + `catalog` cache profile as the product shell (~5 min TTL,
 * busted by PRODUCT_* webhooks). Cart/checkout always re-fetch live; a shopper
 * may see a stale stock count on the PDP but cannot check out against it.
 *
 * @see skills/saleor-paper-storefront/rules/product-high-cardinality.md
 * @see skills/saleor-paper-storefront/rules/product-pdp.md
 * @see skills/saleor-paper-storefront/rules/data-caching.md
 */

/** Saleor `GRAPHQL_PAGINATION_LIMIT` for `productVariants(first:)`. */
export const SALEOR_VARIANT_PAGE_SIZE = 100;

/**
 * Max variants the PDP matrix path will hydrate.
 * Over this: do not ship a partial attribute matrix — use the over-budget buy-box path.
 */
export const PDP_VARIANT_CAP = 200;

/** Variants sampled on PLP cards for swatches / client facet hints. */
export const PLP_VARIANT_SAMPLE = 50;

/** Per-group control ladder thresholds (chips → select → combobox). */
export const VARIANT_CHIP_MAX_OPTIONS = 10;
/** Swatch groups stay as a chip grid up to this count, then jump to combobox (Select cannot show swatches). */
export const VARIANT_SWATCH_CHIP_MAX_OPTIONS = 12;
export const VARIANT_NATIVE_SELECT_MAX_OPTIONS = 24;

/**
 * Product-type slugs that opt into the `external` buy-box strategy (fork extension).
 * Those PDPs skip the attribute matrix even under {@link PDP_VARIANT_CAP}; deep links
 * (`?variant=` / `?sku=`) still resolve a single SKU for ATC. Empty by default.
 *
 * @example `["match-ticket"]` for a stadium seat-map buy box in a fork.
 */
export const EXTERNAL_BUYBOX_PRODUCT_TYPE_SLUGS: readonly string[] = [];
