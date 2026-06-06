import Image from "next/image";
import { PDP_MAIN_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { ProductGalleryShell } from "./product-gallery-shell";

interface ProductGalleryFallbackProps {
	src: string;
	alt: string;
	imageCount: number;
	/** Omit chrome when image count may differ after searchParams resolve (e.g. multi-variant PDP) */
	showChrome?: boolean;
}

/**
 * Server-rendered PDP gallery for Suspense fallback.
 * Matches carousel chrome so the streamed gallery does not shift layout.
 */
export function ProductGalleryFallback({ src, alt, imageCount, showChrome }: ProductGalleryFallbackProps) {
	return (
		<ProductGalleryShell imageCount={imageCount} showChrome={showChrome}>
			<div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-secondary">
				<Image
					src={src}
					alt={alt}
					fill
					className="object-cover"
					sizes={PDP_MAIN_IMAGE_SIZES}
					quality={PRODUCT_IMAGE_QUALITY}
					priority
				/>
			</div>
		</ProductGalleryShell>
	);
}
