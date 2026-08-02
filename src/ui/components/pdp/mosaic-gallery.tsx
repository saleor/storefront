"use client";

import Image from "next/image";
import { PDP_MOSAIC_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { type ImageCarouselImage } from "@/ui/components/ui/image-carousel";
import { PDP_GALLERY_EMPTY_IMAGE_FRAME_CLASS } from "@/ui/components/shared/gallery-image-frame";
import { GalleryImageZoomTrigger } from "@/ui/components/shared/gallery-image-zoom-trigger";
import { GalleryZoomLayer } from "./gallery-zoom-layer";
import { useProductImageViewer } from "./use-product-image-viewer";

interface MosaicGalleryProps {
	images: ImageCarouselImage[];
	productName: string;
}

/**
 * Mosaic PDP gallery — editorial grid of all product images with tap-to-zoom.
 */
export function MosaicGallery({ images, productName }: MosaicGalleryProps) {
	const imagesKey = images.map((image) => image.url).join(",");
	const { viewerIndex, isViewerOpen, openViewer, onViewerOpenChange } = useProductImageViewer(imagesKey);

	if (!images.length) {
		return (
			<div className={PDP_GALLERY_EMPTY_IMAGE_FRAME_CLASS}>
				<span className="text-muted-foreground">No image available</span>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-2 gap-2 sm:gap-3">
				{images.map((image, index) => (
					<GalleryImageZoomTrigger
						key={`${image.url}-${index}`}
						onClick={() => openViewer(index)}
						className="aspect-[4/5] w-full"
						aria-label={image.alt || `${productName} - View ${index + 1}`}
					>
						<Image
							src={image.url}
							alt={image.alt || `${productName} - View ${index + 1}`}
							fill
							className="pointer-events-none object-cover"
							sizes={PDP_MOSAIC_IMAGE_SIZES}
							quality={PRODUCT_IMAGE_QUALITY}
							priority={false}
							loading={index === 0 ? "eager" : "lazy"}
						/>
					</GalleryImageZoomTrigger>
				))}
			</div>
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
