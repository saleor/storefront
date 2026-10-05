# 2026-10-listing-contract

Put category, collection, all-products, and search behind `ListingQuery` / `ListingResult`, with one provider per surface.

Requires `2026-10-storefront-templates`. `upstreamSha` stays empty until the commit that releases this migration exists.

## Steps

1. Move Saleor filter builders and `toProductCardData` into `src/lib/listing/providers/saleor/`. UI keeps option extractors only.
2. Point `LISTING_PROVIDERS` at `saleor` for every surface. A search engine is a new provider and a one-line change for `search`.
3. Render listing routes through `templates.plp.Layout`. Do not await `searchParams` in `Page` except for `redirectToCanonicalCatalogSlug`.
4. Add `$last` / `$before` to category and collection product queries so previous-page works.
5. Run `pnpm run verify`.
