import Image from "next/image";
import { PDP_MOSAIC_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";

interface MosaicGalleryFallbackProps {
	src: string;
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
	alt,
	imageCount,
	showChrome = imageCount > 1,
}: MosaicGalleryFallbackProps) {
	const placeholderCount = showChrome ? Math.max(imageCount - 1, 0) : 0;

	return (
		<div className="grid grid-cols-2 gap-2 sm:gap-3">
			<div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-secondary">
				<Image
					src={src}
					alt={alt}
					fill
					className="object-cover"
					sizes={PDP_MOSAIC_IMAGE_SIZES}
					quality={PRODUCT_IMAGE_QUALITY}
					priority
				/>
			</div>
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
