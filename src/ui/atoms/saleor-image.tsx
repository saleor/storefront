import NextImage from "next/image";
import { preload } from "react-dom";
import { cn } from "@/lib/utils";
import { PAPER_IMAGE_PIPELINE, PRODUCT_IMAGE_QUALITY } from "@/lib/images";

export interface SaleorImageProps {
	/** Largest requested rung — also the `src` fallback for browsers ignoring `srcSet`. */
	src: string;
	/**
	 * Built by `buildSaleorSrcSet()` from aliased Saleor thumbnail fields. When absent
	 * (local asset, CMS upload, single rung) the component falls back to `next/image`.
	 */
	srcSet?: string;
	alt: string;
	sizes: string;
	className?: string;
	/** LCP candidate: eager, high fetch priority, and a preload hint. */
	priority?: boolean;
	/** Overrides the `priority`-derived default — e.g. eager-load a carousel's first slide. */
	loading?: "eager" | "lazy";
	draggable?: boolean;
	/** Only consulted on the `next/image` path — Saleor rungs are pre-encoded. */
	quality?: number;
}

/**
 * Fill-positioned catalog image that prefers Saleor's CDN over Vercel's optimizer.
 *
 * Saleor has already produced a correctly-sized, CloudFront-cached WebP for each rung
 * we request, so sending those through `/_next/image` pays for a transformation that
 * re-derives a file we already have. When a rung set is available this renders a plain
 * `<img srcset>` against the CDN; otherwise it defers to `next/image`.
 *
 * See the `ui-images` rule for the decision table and the Saleor thumbnail mechanics.
 */
export function SaleorImage({
	src,
	srcSet,
	alt,
	sizes,
	className,
	priority = false,
	loading,
	draggable,
	quality = PRODUCT_IMAGE_QUALITY,
}: SaleorImageProps) {
	if (PAPER_IMAGE_PIPELINE === "vercel" || !srcSet) {
		return (
			<NextImage
				src={src}
				alt={alt}
				fill
				sizes={sizes}
				quality={quality}
				className={className}
				priority={priority}
				loading={loading}
				draggable={draggable}
			/>
		);
	}

	// next/image emits this for `priority`; the plain <img> path has to ask for it.
	if (priority) {
		preload(src, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });
	}

	return (
		// eslint-disable-next-line @next/next/no-img-element -- deliberate: Saleor serves a CDN-cached WebP per rung, so next/image would bill a transformation to re-encode an already-optimal file.
		<img
			src={src}
			srcSet={srcSet}
			sizes={sizes}
			alt={alt}
			loading={loading ?? (priority ? "eager" : "lazy")}
			fetchPriority={priority ? "high" : "auto"}
			decoding="async"
			draggable={draggable}
			className={cn("absolute inset-0 h-full w-full", className)}
		/>
	);
}
