"use client";

import * as React from "react";
import Image from "next/image";
import {
	galleryImageFrameClass,
	PDP_GALLERY_EMPTY_IMAGE_FRAME_CLASS,
} from "@/ui/components/shared/gallery-image-frame";
import {
	GalleryImageThumbTrigger,
	GalleryImageZoomTrigger,
} from "@/ui/components/shared/gallery-image-zoom-trigger";
import { PDP_MAIN_IMAGE_SIZES, PDP_THUMBNAIL_IMAGE_SIZES, PRODUCT_IMAGE_QUALITY } from "@/lib/images";
import { cn } from "@/lib/utils";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
	CarouselDots,
	useCarousel,
	type CarouselApi,
} from "@/ui/components/ui/carousel";

export interface ImageCarouselImage {
	url: string;
	alt?: string | null;
}

interface ImageCarouselProps {
	images: ImageCarouselImage[];
	productName: string;
	/** Show navigation arrows (default: true on desktop) */
	showArrows?: boolean;
	/** Show dot indicators (default: true on mobile) */
	showDots?: boolean;
	/** Show thumbnail strip (default: true on desktop) */
	showThumbnails?: boolean;
	/** Callback when active index changes */
	onIndexChange?: (index: number) => void;
	/** Callback when image is tapped/clicked (for lightbox integration) */
	onImageClick?: (index: number) => void;
	/** Additional class name for the container */
	className?: string;
}

/**
 * Image carousel with mobile swipe support.
 *
 * Features:
 * - Horizontal swipe on mobile (Embla Carousel)
 * - Arrow navigation on desktop (hover to reveal)
 * - Thumbnail strip on desktop
 * - Dot indicators on mobile
 * - Main stage is a fixed aspect-[4/5] box; Embla fills it via absolute inset-0
 * - First slide uses loading="eager" (LCP priority lives in ProductGalleryFallback)
 * - Other slides and thumbnails use loading="lazy"
 *
 * Zoom is intentionally not included - use `onImageClick` to integrate
 * with a separate lightbox/zoom component when needed.
 */
export function ImageCarousel({
	images,
	productName,
	showArrows = true,
	showDots = true,
	showThumbnails = true,
	onIndexChange,
	onImageClick,
	className,
}: ImageCarouselProps) {
	const [api, setApi] = React.useState<CarouselApi>();
	const [selectedIndex, setSelectedIndex] = React.useState(0);

	// Reset to first image when images array changes (e.g., variant switch)
	const imagesKey = images.map((img) => img.url).join(",");
	React.useEffect(() => {
		setSelectedIndex(0);
		api?.scrollTo(0, true); // true = instant scroll (no animation)
	}, [imagesKey, api]);

	// Sync selected index from carousel API
	React.useEffect(() => {
		if (!api) return;

		const onSelect = () => {
			const index = api.selectedScrollSnap();
			setSelectedIndex(index);
			onIndexChange?.(index);
		};

		api.on("select", onSelect);
		// Set initial index
		onSelect();

		return () => {
			api.off("select", onSelect);
		};
	}, [api, onIndexChange]);

	const scrollToImage = (index: number) => {
		api?.scrollTo(index);
	};

	// Handle empty images (after hooks to satisfy rules of hooks)
	if (!images.length) {
		return (
			<div className={PDP_GALLERY_EMPTY_IMAGE_FRAME_CLASS}>
				<span className="text-muted-foreground">No image available</span>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-col gap-4", className)}>
			{/* Main Image Carousel */}
			<Carousel
				setApi={setApi}
				opts={{
					align: "start",
					loop: images.length > 1,
				}}
				className="group w-full"
			>
				<div className={galleryImageFrameClass("aspect-[4/5] w-full")}>
					<CarouselContent className="ml-0 h-full" viewportClassName="absolute inset-0 h-full w-full">
						{images.map((image, index) => (
							<CarouselItem key={image.url} className="h-full pl-0">
								{onImageClick ? (
									<GalleryImageZoomTrigger
										className="h-full min-h-0 w-full"
										onClick={() => onImageClick(index)}
										aria-label={image.alt || `${productName} - View ${index + 1}`}
									>
										<Image
											src={image.url}
											alt={image.alt || `${productName} - View ${index + 1}`}
											fill
											className="object-cover"
											sizes={PDP_MAIN_IMAGE_SIZES}
											quality={PRODUCT_IMAGE_QUALITY}
											priority={false}
											loading={index === 0 ? "eager" : "lazy"}
										/>
									</GalleryImageZoomTrigger>
								) : (
									<div className="relative h-full min-h-0 w-full overflow-hidden">
										<Image
											src={image.url}
											alt={image.alt || `${productName} - View ${index + 1}`}
											fill
											className="object-cover"
											sizes={PDP_MAIN_IMAGE_SIZES}
											quality={PRODUCT_IMAGE_QUALITY}
											priority={false}
											loading={index === 0 ? "eager" : "lazy"}
										/>
									</div>
								)}
							</CarouselItem>
						))}
					</CarouselContent>

					{/* Navigation arrows - hidden on mobile, visible on desktop hover */}
					{showArrows && images.length > 1 && (
						<>
							<CarouselPrevious
								variant="ghost"
								className={cn(
									"left-4 z-10 hidden border border-border bg-background opacity-0 shadow-md transition-opacity hover:bg-accent group-hover:opacity-100 md:flex",
									"disabled:opacity-0",
								)}
							/>
							<CarouselNext
								variant="ghost"
								className={cn(
									"right-4 z-10 hidden border border-border bg-background opacity-0 shadow-md transition-opacity hover:bg-accent group-hover:opacity-100 md:flex",
									"disabled:opacity-0",
								)}
							/>
						</>
					)}
				</div>

				{/* Dot indicators for mobile */}
				{showDots && images.length > 1 && <CarouselDots className="mt-4 md:hidden" count={images.length} />}
			</Carousel>

			{/* Thumbnail Strip for desktop */}
			{showThumbnails && images.length > 1 && (
				<div className="scrollbar-hide hidden gap-2 overflow-x-auto px-1 py-1 focus-visible:outline-none md:flex">
					{images.map((image, index) => (
						<GalleryImageThumbTrigger
							key={image.url}
							selected={selectedIndex === index}
							onClick={() => scrollToImage(index)}
							aria-label={`${productName} - Thumbnail ${index + 1}`}
							aria-current={selectedIndex === index ? "true" : undefined}
						>
							<Image
								src={image.url}
								alt=""
								fill
								className="object-cover"
								sizes={PDP_THUMBNAIL_IMAGE_SIZES}
								quality={PRODUCT_IMAGE_QUALITY}
								loading="lazy"
							/>
						</GalleryImageThumbTrigger>
					))}
				</div>
			)}
		</div>
	);
}

/**
 * Hook to use carousel context from child components
 */
export { useCarousel };
