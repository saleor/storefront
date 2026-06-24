"use client";

import { ImageCarousel, type ImageCarouselImage } from "@/ui/components/ui/image-carousel";
import { GalleryZoomLayer } from "./gallery-zoom-layer";
import { useProductImageViewer } from "./use-product-image-viewer";

interface ProductGalleryProps {
	images: ImageCarouselImage[];
	productName: string;
}

/**
 * Standard PDP gallery — Embla carousel with fullscreen pinch-to-zoom.
 */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
	const imagesKey = images.map((image) => image.url).join(",");
	const { viewerIndex, isViewerOpen, openViewer, onViewerOpenChange } = useProductImageViewer(imagesKey);

	return (
		<>
			<ImageCarousel
				images={images}
				productName={productName}
				showArrows={true}
				showDots={true}
				showThumbnails={true}
				onImageClick={openViewer}
			/>
			<GalleryZoomLayer
				images={images}
				productName={productName}
				viewerIndex={viewerIndex}
				isViewerOpen={isViewerOpen}
				onOpenChange={onViewerOpenChange}
			/>
		</>
	);
}
