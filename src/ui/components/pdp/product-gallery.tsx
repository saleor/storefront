"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImage {
	url: string;
	alt?: string | null;
}

interface ProductGalleryProps {
	images: ProductImage[];
	productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	// Handle empty images
	if (!images.length) {
		return (
			<div className="flex aspect-[4/5] w-full items-center justify-center rounded-lg bg-secondary">
				<span className="text-muted-foreground">No image available</span>
			</div>
		);
	}

	const scrollToImage = (index: number) => {
		setActiveIndex(index);
		scrollRef.current?.children[index]?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
	};

	const nextImage = () => scrollToImage((activeIndex + 1) % images.length);
	const prevImage = () => scrollToImage((activeIndex - 1 + images.length) % images.length);

	const currentImage = images[activeIndex];

	return (
		<div className="flex flex-col gap-4">
			{/* Main Image */}
			<div className="group relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-secondary">
				<Image
					src={currentImage?.url || "/placeholder.svg"}
					alt={currentImage?.alt || productName}
					fill
					className={cn(
						"object-cover transition-transform duration-500",
						isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in",
					)}
					onClick={() => setIsZoomed(!isZoomed)}
					priority
					fetchPriority="high"
					sizes="(max-width: 768px) 100vw, 50vw"
				/>

				{/* Navigation arrows */}
				{images.length > 1 && (
					<>
						<button
							type="button"
							onClick={prevImage}
							className="bg-background/90 absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full opacity-0 backdrop-blur-sm transition-opacity hover:bg-background group-hover:opacity-100"
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5" />
						</button>
						<button
							type="button"
							onClick={nextImage}
							className="bg-background/90 absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full opacity-0 backdrop-blur-sm transition-opacity hover:bg-background group-hover:opacity-100"
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5" />
						</button>
					</>
				)}

				{/* Zoom indicator - always visible on mobile, hover on desktop */}
				<div
					className={cn(
						"bg-background/90 absolute bottom-4 right-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs backdrop-blur-sm transition-opacity",
						isZoomed ? "opacity-0" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
					)}
				>
					<ZoomIn className="h-3.5 w-3.5" />
					<span className="sm:hidden">Tap to zoom</span>
					<span className="hidden sm:inline">Click to zoom</span>
				</div>
			</div>

			{/* Thumbnail Strip */}
			{images.length > 1 && (
				<div ref={scrollRef} className="scrollbar-hide flex gap-2 overflow-x-auto px-1 py-1">
					{images.map((image, index) => (
						<button
							type="button"
							key={index}
							onClick={() => scrollToImage(index)}
							className={cn(
								"relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md transition-all",
								activeIndex === index
									? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
									: "opacity-60 hover:opacity-100",
							)}
						>
							<Image
								src={image.url || "/placeholder.svg"}
								alt={`${productName} - View ${index + 1}`}
								fill
								className="object-cover"
								sizes="80px"
							/>
						</button>
					))}
				</div>
			)}

			{/* Image counter dots for mobile */}
			{images.length > 1 && (
				<div className="flex justify-center gap-1.5 md:hidden">
					{images.map((_, index) => (
						<button
							type="button"
							key={index}
							onClick={() => scrollToImage(index)}
							className={cn(
								"h-2 w-2 rounded-full transition-colors",
								activeIndex === index ? "bg-foreground" : "bg-border",
							)}
							aria-label={`Go to image ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
}
