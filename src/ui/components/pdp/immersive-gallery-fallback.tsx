import Image from "next/image";
import { PDP_IMMERSIVE_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { GalleryImageFrame, galleryImageFrameClass } from "@/ui/components/shared/gallery-image-frame";
import { PDP_IMMERSIVE_IMAGE_HEIGHT } from "./gallery-layout";

interface ImmersiveGalleryFallbackProps {
	src: string;
	alt: string;
	/** Accepted for a uniform gallery-registry signature; immersive shows a single hero frame. */
	imageCount?: number;
	showChrome?: boolean;
}

/**
 * Server-rendered immersive gallery for the Suspense fallback.
 * Renders the first (default) image at the immersive size with LCP priority so
 * the streamed gallery does not shift layout.
 */
export function ImmersiveGalleryFallback({ src, alt }: ImmersiveGalleryFallbackProps) {
	return (
		<div className="flex flex-col gap-4">
			<div className="overflow-hidden">
				<div className="flex gap-2">
					<GalleryImageFrame
						className={galleryImageFrameClass(
							"aspect-square w-full shrink-0 lg:w-auto lg:basis-auto",
							PDP_IMMERSIVE_IMAGE_HEIGHT,
						)}
					>
						<Image
							src={src}
							alt={alt}
							fill
							className="object-cover"
							sizes={PDP_IMMERSIVE_IMAGE_SIZES}
							quality={PRODUCT_IMAGE_QUALITY}
							priority
						/>
					</GalleryImageFrame>
				</div>
			</div>
		</div>
	);
}

/** Pre-stream skeleton matching the immersive gallery footprint. */
export function ImmersiveGallerySkeleton() {
	return (
		<div className="flex flex-col gap-4">
			<div
				className={`aspect-square w-full animate-pulse rounded-lg bg-muted lg:w-auto ${PDP_IMMERSIVE_IMAGE_HEIGHT}`}
			/>
		</div>
	);
}
