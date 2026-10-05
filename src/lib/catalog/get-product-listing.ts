/**
 * Cached listing grids moved to `src/lib/listing`.
 * This module remains so older imports of the cacheability predicate keep working.
 *
 * Canonical first pages are cached. Filters, cursors, and search stay live.
 * See `isCacheableListingQuery` in `src/lib/listing/cacheability.ts`.
 */
export { isCacheableListingView, type ListingViewParams } from "./listing-view";
