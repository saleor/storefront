"use client";

import { ImageCarousel, type ImageCarouselImage } from "@/ui/components/ui/image-carousel";

interface ProductGalleryProps {
	images: ImageCarouselImage[];
	productName: string;
}

/**
 * Product Gallery with mobile swipe support.
 *
 * Features:
 * - Horizontal swipe on mobile (Embla Carousel)
 * - Arrow navigation on desktop (hover to reveal)
 * - Thumbnail strip on desktop
 * - Dot indicators on mobile
 * - First image has priority for LCP optimization
 *
 * Note: Zoom/lightbox is not included - can be added separately
 * via the `onImageClick` prop if needed in the future.
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
	return (
		<ImageCarousel
			images={images}
			productName={productName}
			showArrows={true}
			showDots={true}
			showThumbnails={true}
		/>
	);
}
