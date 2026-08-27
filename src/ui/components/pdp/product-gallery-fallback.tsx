import { PDP_MAIN_IMAGE_SIZES } from "@/lib/images";
import { SaleorImage } from "@/ui/atoms/saleor-image";
import { GalleryImageFrame } from "@/ui/components/shared/gallery-image-frame";
import { ProductGalleryShell } from "./product-gallery-shell";

interface ProductGalleryFallbackProps {
	src: string;
	srcSet?: string;
	alt: string;
	imageCount: number;
	/** Omit chrome when image count may differ after searchParams resolve (e.g. multi-variant PDP) */
	showChrome?: boolean;
}

/**
 * Server-rendered PDP gallery for Suspense fallback.
 * Matches carousel chrome so the streamed gallery does not shift layout.
 */
export function ProductGalleryFallback({
	src,
	srcSet,
	alt,
	imageCount,
	showChrome,
}: ProductGalleryFallbackProps) {
	return (
		<ProductGalleryShell imageCount={imageCount} showChrome={showChrome}>
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
