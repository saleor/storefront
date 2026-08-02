/**
 * PDP gallery registry — the single source of truth that maps each
 * {@link PdpGalleryLayout} to its three render surfaces:
 *
 * - `Gallery`   — the live renderer (reads variant images)
 * - `Fallback`  — server-rendered LCP image shown in the gallery Suspense boundary
 * - `Skeleton`  — server-rendered placeholder for route `loading.tsx`
 *
 * ## Why a registry (the canonical pattern)
 *
 * A Paper shop ships exactly ONE gallery layout, chosen at build time. We want a
 * growing *library* of layouts without shipping the unused ones. Two rules make
 * that automatic so nobody has to think about it per-layout:
 *
 * 1. **Interactive (`"use client"`) renderers are loaded via `next/dynamic`** so
 *    each compiles to its own chunk and only the active layout's JS is ever
 *    requested by the browser. Fallbacks and skeletons stay Server Components.
 * 2. **The registry is the only place that references the renderers.** They are
 *    NOT re-exported from `index.ts`; consumers (`VariantGalleryDynamic`,
 *    `ProductShell`, `ProductRouteSkeleton`) read the active variant through
 *    {@link activeGalleryVariant}. This prevents a `"use client"` renderer from
 *    leaking into the bundle via a barrel that a Server Component imports.
 *
 * `Record<PdpGalleryLayout, GalleryVariant>` makes this exhaustive: add a layout
 * to the union and the compiler forces you to register all three surfaces here —
 * the only file you touch besides the component itself and `gallery-layout.ts`.
 *
 * ### Adding a layout
 * 1. Create `my-gallery.tsx` (+ `my-gallery-fallback.tsx`). Prefer a Server
 *    Component; if it needs interactivity, mark it `"use client"`.
 * 2. Add the key to {@link PdpGalleryLayout} and classes to `PDP_LAYOUT_CLASSES`.
 * 3. Add one entry below (dynamic import for client renderers).
 */
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ImageCarouselImage } from "@/ui/components/ui/image-carousel";
import { PDP_GALLERY_LAYOUT, type PdpGalleryLayout } from "./gallery-layout";
import { galleryImageFrameClass } from "@/ui/components/shared/gallery-image-frame";
import { MosaicGalleryFallback, MosaicGallerySkeleton } from "./mosaic-gallery-fallback";
import { ProductGalleryFallback } from "./product-gallery-fallback";
import { ProductGalleryShell } from "./product-gallery-shell";
import { ImmersiveGalleryFallback, ImmersiveGallerySkeleton } from "./immersive-gallery-fallback";

export interface GalleryRendererProps {
	images: ImageCarouselImage[];
	productName: string;
}

export interface GalleryFallbackProps {
	src: string;
	alt: string;
	imageCount: number;
	/** Layout-specific extra chrome or placeholder tiles when the product has multiple images. */
	showChrome?: boolean;
}

export interface GalleryVariant {
	Gallery: ComponentType<GalleryRendererProps>;
	Fallback: ComponentType<GalleryFallbackProps>;
	Skeleton: ComponentType;
}

/** Standard layout's route/loading skeleton (4:5 hero + carousel chrome). */
function StandardGallerySkeleton() {
	return (
		<ProductGalleryShell imageCount={1} showChrome={false}>
			<div className={galleryImageFrameClass("aspect-[4/5] w-full animate-pulse bg-muted")} />
		</ProductGalleryShell>
	);
}

// Interactive renderers — lazy so their JS (incl. Embla) ships only when active.
const LazyStandardGallery = dynamic(() => import("./product-gallery").then((mod) => mod.ProductGallery), {
	loading: () => <StandardGallerySkeleton />,
});

const LazyImmersiveGallery = dynamic(
	() => import("./immersive-gallery").then((mod) => mod.ImmersiveGallery),
	{
		loading: () => <ImmersiveGallerySkeleton />,
	},
);

const LazyMosaicGallery = dynamic(() => import("./mosaic-gallery").then((mod) => mod.MosaicGallery), {
	loading: () => <MosaicGallerySkeleton />,
});

export const GALLERY_REGISTRY: Record<PdpGalleryLayout, GalleryVariant> = {
	standard: {
		Gallery: LazyStandardGallery,
		Fallback: ProductGalleryFallback,
		Skeleton: StandardGallerySkeleton,
	},
	immersive: {
		Gallery: LazyImmersiveGallery,
		Fallback: ImmersiveGalleryFallback,
		Skeleton: ImmersiveGallerySkeleton,
	},
	// Client renderer — lazy so zoom + grid JS ships only when mosaic is active.
	mosaic: {
		Gallery: LazyMosaicGallery,
		Fallback: MosaicGalleryFallback,
		Skeleton: MosaicGallerySkeleton,
	},
};

/** The render surfaces for the build-time active layout ({@link PDP_GALLERY_LAYOUT}). */
export function activeGalleryVariant(): GalleryVariant {
	return GALLERY_REGISTRY[PDP_GALLERY_LAYOUT];
}
