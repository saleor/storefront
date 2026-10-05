# Detect

The shop still builds Saleor `ProductWhereInput` from `src/ui`, or search does not go through `loadListing`.

Look for:

- `buildProductListingConstraints` imported from `@/ui`
- `src/lib/search/saleor-provider.ts`
- a listing `page.tsx` that awaits `searchParams` outside `redirectToCanonicalCatalogSlug` and outside a Suspense child
