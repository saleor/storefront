/**
 * PDP gallery layout — single, developer-owned choice for the whole shop.
 *
 * This is intentionally a build-time constant, not a runtime/per-product
 * decision: a Paper shop has one PDP style. To change the gallery for the
 * entire storefront, flip {@link PDP_GALLERY_LAYOUT} below. Reverting is a
 * one-line change back to `"standard"`.
 *
 * Each layout bundles:
 * - the gallery renderer used by `VariantGalleryDynamic` (the swap, "like the
 *   variant selector renderers"), and
 * - the page-shell classes (container width, grid ratio, sticky behaviour) that
 *   the gallery presentation is coupled to.
 *
 * Keeping both in one place means the shell, the dynamic island, the Suspense
 * fallback, and the skeleton can never disagree about the active layout.
 *
 * Agent note: when asked to make the PDP immersive (wide gallery + sticky buy box), set this to
 * `"immersive"`; to restore the classic split layout, set it to `"standard"`; for
 * an editorial grid where every image is visible at once, set it to `"mosaic"`.
 * For edge-to-edge width, change the active layout's `main` class to `container-full`.
 */
export type PdpGalleryLayout = "standard" | "immersive" | "mosaic";

/** Active gallery layout for the whole storefront. */
export const PDP_GALLERY_LAYOUT: PdpGalleryLayout = "immersive";

export interface PdpLayoutClasses {
	/** `<main>` wrapper. */
	main: string;
	/** Row wrapping the gallery column + info column. */
	grid: string;
	/** Gallery column wrapper. */
	galleryColumn: string;
	/** Product info / buy-box column wrapper. */
	infoColumn: string;
	/**
	 * Where the `ProductAttributes` accordion (description / details / shipping)
	 * renders.
	 * - `"info"`: under the buy box in the info column (classic split layout).
	 * - `"gallery"`: below the images in the wide column, keeping the sticky buy
	 *   box short and above the fold (immersive / on.com style).
	 */
	attributesPlacement: "info" | "gallery";
	/**
	 * When {@link attributesPlacement} is `"gallery"`, classes for the attributes
	 * block as a third grid/flex sibling (not nested in the gallery column).
	 * Mobile: `order-3` keeps description below the buy box; desktop: `lg:row-start-2`
	 * places it under the filmstrip in the wide column.
	 */
	attributesGalleryBlock?: string;
}

/**
 * Desktop height of an immersive square image — fits the first frame above the
 * fold. Composed from chrome-height tokens (`--chrome-offset`) + a PDP-local
 * reserve (`--pdp-immersive-reserved`) defined in `brand.css`, so it self-corrects
 * when the announcement bar changes and never relies on a magic constant. Full
 * Tailwind literal (underscores = spaces) so the JIT scanner picks it up.
 */
export const PDP_IMMERSIVE_IMAGE_HEIGHT =
	"lg:h-[calc(100svh_-_var(--chrome-offset)_-_var(--pdp-immersive-reserved))]";

/** Sticky offset that clears the (sticky) header with a small gap. */
const STICKY_BELOW_HEADER = "lg:top-[calc(var(--header-height)_+_2rem)]";

export const PDP_LAYOUT_CLASSES: Record<PdpGalleryLayout, PdpLayoutClasses> = {
	standard: {
		main: "container-content flex-1 py-4 sm:py-6 lg:py-10",
		grid: "grid gap-8 lg:grid-cols-2 lg:gap-16",
		galleryColumn: `lg:sticky ${STICKY_BELOW_HEADER} lg:self-start`,
		infoColumn: "flex flex-col gap-3",
		attributesPlacement: "info",
	},
	immersive: {
		main: "container-full flex-1 py-4 sm:py-6",
		grid: "flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(20rem,30rem)] lg:items-start lg:gap-12",
		galleryColumn: "order-1 min-w-0 lg:col-start-1 lg:row-start-1",
		infoColumn: `order-2 flex flex-col gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky ${STICKY_BELOW_HEADER} lg:self-start`,
		attributesPlacement: "gallery",
		attributesGalleryBlock: "order-3 mt-10 min-w-0 lg:col-start-1 lg:row-start-2 lg:mt-12",
	},
	/**
	 * Editorial mosaic: every image tiled in a wide 2-column grid
	 * with a narrow sticky buy box beside it. No carousel — the page scrolls
	 * through all imagery. Description/details sit under the buy box (the gallery
	 * column is already tall), and the mobile sticky bar keeps add-to-cart
	 * reachable while the shopper scans the grid.
	 */
	mosaic: {
		main: "container-wide flex-1 py-4 sm:py-6 lg:py-10",
		grid: "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)] lg:items-start lg:gap-12",
		galleryColumn: "min-w-0",
		infoColumn: `flex flex-col gap-3 lg:sticky ${STICKY_BELOW_HEADER} lg:self-start`,
		attributesPlacement: "info",
	},
};
