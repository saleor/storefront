import Image from "next/image";
import { PDP_MOSAIC_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { type ImageCarouselImage } from "@/ui/components/ui/image-carousel";

interface MosaicGalleryProps {
	images: ImageCarouselImage[];
	productName: string;
}

/**
 * Mosaic PDP gallery — editorial grid of all product images.
 *
 * Renders every image at once in a 2-column editorial grid — no carousel, the
 * page itself scrolls through the imagery while the buy box stays sticky beside
 * it. Pure presentation with no interactivity, so it stays a Server Component;
 * variant-aware images are resolved upstream in `VariantGalleryDynamic`.
 */
export function MosaicGallery({ images, productName }: MosaicGalleryProps) {
	if (!images.length) {
		return (
			<div className="flex aspect-[4/5] w-full items-center justify-center rounded-lg bg-secondary">
				<span className="text-muted-foreground">No image available</span>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-2 sm:gap-3">
			{images.map((image, index) => (
				<div
					key={`${image.url}-${index}`}
					className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-secondary"
				>
					<Image
						src={image.url}
						alt={image.alt || `${productName} - View ${index + 1}`}
						fill
						className="object-cover"
						sizes={PDP_MOSAIC_IMAGE_SIZES}
						quality={PRODUCT_IMAGE_QUALITY}
						priority={false}
						loading={index === 0 ? "eager" : "lazy"}
					/>
				</div>
			))}
		</div>
	);
}
