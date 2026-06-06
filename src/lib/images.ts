/**
 * Shared Next.js Image props for catalog surfaces.
 * Keeps `sizes` aligned with layout breakpoints so the optimizer requests appropriately sized variants.
 */

/** Homepage grid: 1 col → 2 col (sm) → 3 col (lg) */
export const HOMEPAGE_IMAGE_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

/** PLP / collection / category grid: 2 col → 3 col (lg) */
export const PLP_IMAGE_SIZES = "(max-width: 1024px) 50vw, 33vw";

/** PDP main gallery: full width on mobile, half viewport on desktop split layout */
export const PDP_MAIN_IMAGE_SIZES = "(max-width: 768px) 100vw, 50vw";

/** PDP desktop thumbnail strip */
export const PDP_THUMBNAIL_IMAGE_SIZES = "80px";

/** First N grid cards visible above the fold on 2-column layouts */
export const GRID_ABOVE_FOLD_PRIORITY_COUNT = 2;

/** Default quality for product photography — balances size and clarity */
export const PRODUCT_IMAGE_QUALITY = 80;
