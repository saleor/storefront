export { ProductGallery } from "./product-gallery";
export { ProductGalleryFallback } from "./product-gallery-fallback";
export { ProductGalleryShell } from "./product-gallery-shell";
export { ImmersiveGallery } from "./immersive-gallery";
export { ImmersiveGalleryFallback, ImmersiveGallerySkeleton } from "./immersive-gallery-fallback";
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
export { getGalleryImages, getDefaultGalleryImages, resolveSelectedVariantId } from "./gallery-utils";
