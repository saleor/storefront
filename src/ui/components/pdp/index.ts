// Gallery renderers/fallbacks/skeletons are NOT re-exported here on purpose.
// The interactive renderers are Client Components (Embla); routing them through
// this barrel — which Server Components import — risks pulling every layout's JS
// into the bundle. Consume galleries only via the registry, which lazy-loads the
// active layout's renderer. See `gallery-registry.tsx`.
export {
	activeGalleryVariant,
	GALLERY_REGISTRY,
	type GalleryRendererProps,
	type GalleryFallbackProps,
	type GalleryVariant,
} from "./gallery-registry";
export {
	PDP_GALLERY_LAYOUT,
	PDP_LAYOUT_CLASSES,
	type PdpGalleryLayout,
	type PdpLayoutClasses,
} from "./gallery-layout";
export { ProductAttributes } from "./product-attributes";
export { AddToCart } from "./add-to-cart";
export { StickyBar } from "./sticky-bar";

// Variant Selection System
// Re-export main components for convenient access
export {
	VariantSelectionSection,
	VariantSelector,
	ColorSwatchOption,
	SizeButtonOption,
	TextOption,
} from "./variant-selection";

// Cache Components - Dynamic PDP islands with Suspense support
export { ProductRouteSkeleton } from "./product-route-skeleton";
export { VariantGalleryDynamic, GallerySkeleton } from "./variant-gallery-dynamic";
export { VariantSectionDynamic, VariantSectionSkeleton } from "./variant-section-dynamic";
export { VariantSectionError } from "./variant-section-error";
export {
	getGalleryImages,
	getDefaultGalleryImages,
	resolveSelectedVariantId,
	type Product,
	type Variant,
} from "./gallery-utils";
