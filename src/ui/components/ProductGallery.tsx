"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import { clsx } from "clsx";

export interface ProductImage {
	url: string;
	alt?: string | null;
}

export interface ProductGalleryProps {
	images: ProductImage[];
	productName: string;
	enableZoom?: boolean;
}

export function ProductGallery({ images, productName, enableZoom = true }: ProductGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isZoomed, setIsZoomed] = useState(false);

	const currentImage = images[selectedIndex] || images[0];

	const goToPrevious = useCallback(() => {
		setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
	}, [images.length]);

	const goToNext = useCallback(() => {
		setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
	}, [images.length]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "ArrowLeft") {
			goToPrevious();
		} else if (e.key === "ArrowRight") {
			goToNext();
		} else if (e.key === "Escape" && isZoomed) {
			setIsZoomed(false);
		}
	}, [goToPrevious, goToNext, isZoomed]);

	if (!images.length) {
		return (
			<div className="aspect-square bg-secondary-100 rounded-lg flex items-center justify-center">
				<span className="text-secondary-400">No image available</span>
			</div>
		);
	}

	return (
		<div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
			{/* Main Image */}
			<div className="relative aspect-square overflow-hidden rounded-lg bg-secondary-50 group">
				<Image
					src={currentImage.url}
					alt={currentImage.alt || productName}
					fill
					priority
					className="object-cover transition-transform duration-300"
					sizes="(max-width: 768px) 100vw, 50vw"
				/>

				{/* Navigation Arrows */}
				{images.length > 1 && (
					<>
						<button
							onClick={goToPrevious}
							className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5 text-secondary-700" />
						</button>
						<button
							onClick={goToNext}
							className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5 text-secondary-700" />
						</button>
					</>
				)}

				{/* Zoom Button */}
				{enableZoom && (
					<button
						onClick={() => setIsZoomed(true)}
						className="absolute bottom-4 right-4 p-2 rounded-full bg-white/80 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
						aria-label="Zoom image"
					>
						<ZoomIn className="h-5 w-5 text-secondary-700" />
					</button>
				)}

				{/* Image Counter */}
				{images.length > 1 && (
					<div className="absolute bottom-4 left-4 px-2 py-1 rounded bg-black/50 text-white text-xs">
						{selectedIndex + 1} / {images.length}
					</div>
				)}
			</div>

			{/* Thumbnails */}
			{images.length > 1 && (
				<div className="flex gap-2 overflow-x-auto pb-2">
					{images.map((image, index) => (
						<button
							key={index}
							onClick={() => setSelectedIndex(index)}
							className={clsx(
								"relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 transition-colors",
								index === selectedIndex
									? "border-primary-500"
									: "border-transparent hover:border-secondary-300"
							)}
							aria-label={`View image ${index + 1}`}
							aria-current={index === selectedIndex}
						>
							<Image
								src={image.url}
								alt={image.alt || `${productName} thumbnail ${index + 1}`}
								fill
								className="object-cover"
								sizes="80px"
							/>
						</button>
					))}
				</div>
			)}

			{/* Zoom Modal */}
			{isZoomed && enableZoom && (
				<div 
					className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
					onClick={() => setIsZoomed(false)}
				>
					<button
						onClick={() => setIsZoomed(false)}
						className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
						aria-label="Close zoom"
					>
						<X className="h-6 w-6 text-white" />
					</button>

					{/* Navigation in Zoom */}
					{images.length > 1 && (
						<>
							<button
								onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
								className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
								aria-label="Previous image"
							>
								<ChevronLeft className="h-8 w-8 text-white" />
							</button>
							<button
								onClick={(e) => { e.stopPropagation(); goToNext(); }}
								className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
								aria-label="Next image"
							>
								<ChevronRight className="h-8 w-8 text-white" />
							</button>
						</>
					)}

					<div className="relative w-full h-full max-w-4xl max-h-[90vh] m-4">
						<Image
							src={currentImage.url}
							alt={currentImage.alt || productName}
							fill
							className="object-contain"
							sizes="100vw"
							priority
						/>
					</div>
				</div>
			)}
		</div>
	);
}
