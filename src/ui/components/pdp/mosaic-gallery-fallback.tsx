import { PDP_MOSAIC_IMAGE_SIZES } from "@/lib/images";
import { SaleorImage } from "@/ui/atoms/saleor-image";
import { GalleryImageFrame } from "@/ui/components/shared/gallery-image-frame";

interface MosaicGalleryFallbackProps {
	src: string;
	srcSet?: string;
	alt: string;
	imageCount: number;
	/** Omit placeholder tiles when image count may differ after searchParams resolve. */
	showChrome?: boolean;
}

/**
 * Server-rendered mosaic gallery for the Suspense fallback.
 * Renders the first image with LCP priority plus muted placeholder tiles for the
 * remaining images so the streamed grid does not shift layout.
 */
export function MosaicGalleryFallback({
	src,
	srcSet,
	alt,
	imageCount,
	showChrome = imageCount > 1,
}: MosaicGalleryFallbackProps) {
	const placeholderCount = showChrome ? Math.max(imageCount - 1, 0) : 0;

	return (
		<div className="grid grid-cols-2 gap-2 sm:gap-3">
			<GalleryImageFrame className="aspect-[4/5] w-full">
				<SaleorImage
					src={src}
					srcSet={srcSet}
					alt={alt}
					className="object-cover"
					sizes={PDP_MOSAIC_IMAGE_SIZES}
					priority
				/>
			</GalleryImageFrame>
			{Array.from({ length: placeholderCount }).map((_, index) => (
				<div key={index} className="aspect-[4/5] w-full animate-pulse rounded-lg bg-muted" />
			))}
		</div>
	);
}

/** Pre-stream skeleton matching the mosaic gallery footprint. */
export function MosaicGallerySkeleton({ tiles = 4 }: { tiles?: number }) {
	return (
		<div className="grid grid-cols-2 gap-2 sm:gap-3">
			{Array.from({ length: tiles }).map((_, index) => (
				<div key={index} className="aspect-[4/5] w-full animate-pulse rounded-lg bg-muted" />
			))}
		</div>
	);
}
