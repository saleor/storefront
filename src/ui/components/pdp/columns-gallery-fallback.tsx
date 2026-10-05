import { PDP_MAIN_IMAGE_SIZES } from "@/lib/images";
import { SaleorImage } from "@/ui/atoms/saleor-image";
import { GalleryImageFrame, galleryImageFrameClass } from "@/ui/components/shared/gallery-image-frame";
import { ProductGalleryShell } from "./product-gallery-shell";

export function ColumnsGalleryFallback({
	src,
	srcSet,
	alt,
	imageCount,
	showChrome,
}: {
	src: string;
	srcSet?: string;
	alt: string;
	imageCount: number;
	showChrome?: boolean;
}) {
	return (
		<ProductGalleryShell imageCount={imageCount} showChrome={showChrome} thumbnailPlacement="start">
			<GalleryImageFrame className="aspect-[4/5] w-full">
				<SaleorImage
					src={src}
					srcSet={srcSet}
					alt={alt}
					className="object-cover"
					sizes={PDP_MAIN_IMAGE_SIZES}
					priority
				/>
			</GalleryImageFrame>
		</ProductGalleryShell>
	);
}

export function ColumnsGallerySkeleton() {
	return (
		<ProductGalleryShell imageCount={1} showChrome={false} thumbnailPlacement="start">
			<div className={galleryImageFrameClass("aspect-[4/5] w-full animate-pulse bg-muted")} />
		</ProductGalleryShell>
	);
}
