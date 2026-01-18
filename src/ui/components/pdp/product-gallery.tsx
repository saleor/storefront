"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { ImageCarousel, type ImageCarouselImage } from "@/ui/components/ui/image-carousel";

interface ProductGalleryProps {
	images: ImageCarouselImage[];
	productName: string;
	/** Server-rendered first image for LCP - displayed until client hydrates */
	children?: ReactNode;
}

/**
 * Product Gallery with mobile swipe support.
 *
 * Features:
 * - Horizontal swipe on mobile (Embla Carousel)
 * - Arrow navigation on desktop (hover to reveal)
 * - Thumbnail strip on desktop
 * - Dot indicators on mobile
 * - LCP optimization via server-rendered first image
 *
 * Note: Zoom/lightbox is not included - can be added separately
 * via the `onImageClick` prop if needed in the future.
 */
export function ProductGallery({ images, productName, children }: ProductGalleryProps) {
	return (
		<ImageCarousel
			images={images}
			productName={productName}
			showArrows={true}
			showDots={true}
			showThumbnails={true}
		>
			{children}
		</ImageCarousel>
	);
}

/**
 * Server Component for the first gallery image (LCP optimization).
 *
 * This renders on the server and is displayed immediately in the initial HTML,
 * ensuring the Largest Contentful Paint image loads as fast as possible.
 */
export function ProductGalleryImage({
	src,
	alt,
	priority = true,
}: {
	src: string;
	alt: string;
	priority?: boolean;
}) {
	return (
		<Image
			src={src}
			alt={alt}
			fill
			className="object-cover"
			sizes="(max-width: 768px) 100vw, 50vw"
			priority={priority}
		/>
	);
}
