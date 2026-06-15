/**
 * Shared Next.js Image props for catalog surfaces.
 * Keeps `sizes` aligned with layout breakpoints so the optimizer requests appropriately sized variants.
 */

/**
 * Homepage featured collection grid: 2 col → 4 col (lg).
 * Pair with ProductGrid desktopColumns={4}.
 */
export const FEATURED_COLLECTION_IMAGE_SIZES =
	"(max-width: 1024px) calc((100vw - 3rem) / 2), calc((min(100vw, 80rem) - 4rem - 4.5rem) / 4)";

/**
 * PLP / collection / category grid: 2 col → 3 col (lg).
 * Accounts for px-4/px-8 padding and gap-4/gap-6 between cards.
 */
export const PLP_IMAGE_SIZES =
	"(max-width: 1024px) calc((100vw - 3rem) / 2), calc((min(100vw, 80rem) - 4rem - 3rem) / 3)";

/** Full-width category/collection hero background */
export const PLP_HERO_IMAGE_SIZES = "100vw";

/** PDP main gallery: full width on mobile, half viewport on desktop split layout */
export const PDP_MAIN_IMAGE_SIZES = "(max-width: 768px) 100vw, 50vw";

/** PDP desktop thumbnail strip */
export const PDP_THUMBNAIL_IMAGE_SIZES = "80px";

/** LCP candidate on Home, PLP, and PDP — only one high-priority image per viewport */
export const LCP_IMAGE_PRIORITY_COUNT = 1;

/** Match Next.js default — higher values slow cold /_next/image encoding on Vercel */
export const PRODUCT_IMAGE_QUALITY = 75;
