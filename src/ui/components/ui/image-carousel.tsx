"use client";

import * as React from "react";
import Image from "next/image";
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
	/** Server-rendered first image for LCP - displayed until client hydrates */
	children?: React.ReactNode;
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
 * - LCP optimization via server-rendered first image
 *
 * Zoom is intentionally not included - use `onImageClick` to integrate
 * with a separate lightbox/zoom component when needed.
 */
export function ImageCarousel({
	images,
	productName,
	children,
	showArrows = true,
	showDots = true,
	showThumbnails = true,
	onIndexChange,
	onImageClick,
	className,
}: ImageCarouselProps) {
	const [api, setApi] = React.useState<CarouselApi>();
	const [selectedIndex, setSelectedIndex] = React.useState(0);

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
			<div className="flex aspect-[4/5] w-full items-center justify-center rounded-lg bg-secondary">
				<span className="text-muted-foreground">No image available</span>
			</div>
		);
	}

	// Show server-rendered image for LCP optimization
	const showServerImage = children && selectedIndex === 0;

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
				<div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-secondary">
					<CarouselContent className="ml-0">
						{images.map((image, index) => (
							<CarouselItem key={index} className="pl-0">
								<div
									className={cn("relative aspect-[4/5] w-full", onImageClick && "cursor-pointer")}
									onClick={() => onImageClick?.(index)}
								>
									{/* Server-rendered LCP image for first slide */}
									{showServerImage && index === 0 ? (
										children
									) : (
										<Image
											src={image.url}
											alt={image.alt || `${productName} - View ${index + 1}`}
											fill
											className="object-cover"
											sizes="(max-width: 768px) 100vw, 50vw"
											priority={index === 0}
										/>
									)}
								</div>
							</CarouselItem>
						))}
					</CarouselContent>

					{/* Navigation arrows - hidden on mobile, visible on desktop hover */}
					{showArrows && images.length > 1 && (
						<>
							<CarouselPrevious
								className={cn(
									"bg-background/90 left-4 hidden opacity-0 backdrop-blur-sm transition-opacity hover:bg-background group-hover:opacity-100 md:flex",
									"disabled:opacity-0",
								)}
							/>
							<CarouselNext
								className={cn(
									"bg-background/90 right-4 hidden opacity-0 backdrop-blur-sm transition-opacity hover:bg-background group-hover:opacity-100 md:flex",
									"disabled:opacity-0",
								)}
							/>
						</>
					)}
				</div>

				{/* Dot indicators for mobile */}
				{showDots && images.length > 1 && <CarouselDots className="mt-4 md:hidden" />}
			</Carousel>

			{/* Thumbnail Strip for desktop */}
			{showThumbnails && images.length > 1 && (
				<div className="scrollbar-hide hidden gap-2 overflow-x-auto px-1 py-1 md:flex">
					{images.map((image, index) => (
						<button
							type="button"
							key={index}
							onClick={() => scrollToImage(index)}
							className={cn(
								"relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md transition-all",
								selectedIndex === index
									? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
									: "opacity-60 hover:opacity-100",
							)}
						>
							<Image
								src={image.url}
								alt={`${productName} - Thumbnail ${index + 1}`}
								fill
								className="object-cover"
								sizes="80px"
							/>
						</button>
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
