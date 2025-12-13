"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from "lucide-react";
import { clsx } from "clsx";
import { ensureHttps } from "@/lib/utils";

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
	const [zoomLevel, setZoomLevel] = useState(1);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const dragStart = useRef({ x: 0, y: 0 });
	const imageRef = useRef<HTMLDivElement>(null);

	// Ensure all image URLs use HTTPS
	const secureImages = useMemo(() => images.map((img) => ({ ...img, url: ensureHttps(img.url) })), [images]);

	const currentImage = secureImages[selectedIndex] || secureImages[0];

	const goToPrevious = useCallback(() => {
		setSelectedIndex((prev) => (prev > 0 ? prev - 1 : secureImages.length - 1));
	}, [secureImages.length]);

	const goToNext = useCallback(() => {
		setSelectedIndex((prev) => (prev < secureImages.length - 1 ? prev + 1 : 0));
	}, [secureImages.length]);

	const handleZoomIn = useCallback(() => {
		setZoomLevel((prev) => Math.min(prev + 0.5, 3));
	}, []);

	const handleZoomOut = useCallback(() => {
		setZoomLevel((prev) => {
			const newLevel = Math.max(prev - 0.5, 1);
			if (newLevel === 1) {
				setPosition({ x: 0, y: 0 });
			}
			return newLevel;
		});
	}, []);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (zoomLevel > 1) {
				setIsDragging(true);
				dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
			}
		},
		[zoomLevel, position],
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (isDragging && zoomLevel > 1) {
				const newX = e.clientX - dragStart.current.x;
				const newY = e.clientY - dragStart.current.y;

				// Limit panning based on zoom level
				const maxPan = (zoomLevel - 1) * 200;
				setPosition({
					x: Math.max(-maxPan, Math.min(maxPan, newX)),
					y: Math.max(-maxPan, Math.min(maxPan, newY)),
				});
			}
		},
		[isDragging, zoomLevel],
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	const resetZoom = useCallback(() => {
		setZoomLevel(1);
		setPosition({ x: 0, y: 0 });
	}, []);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				goToPrevious();
			} else if (e.key === "ArrowRight") {
				goToNext();
			} else if (e.key === "Escape") {
				if (isZoomed) {
					setIsZoomed(false);
					resetZoom();
				}
			} else if (e.key === "+" || e.key === "=") {
				handleZoomIn();
			} else if (e.key === "-") {
				handleZoomOut();
			}
		},
		[goToPrevious, goToNext, isZoomed, handleZoomIn, handleZoomOut, resetZoom],
	);

	const openZoomModal = useCallback(() => {
		setIsZoomed(true);
		setZoomLevel(1);
		setPosition({ x: 0, y: 0 });
	}, []);

	const closeZoomModal = useCallback(() => {
		setIsZoomed(false);
		resetZoom();
	}, [resetZoom]);

	if (!secureImages.length) {
		return (
			<div className="flex aspect-square items-center justify-center rounded-lg bg-secondary-100">
				<span className="text-secondary-400">No image available</span>
			</div>
		);
	}

	return (
		<div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
			{/* Main Image */}
			<div className="group relative aspect-square overflow-hidden rounded-lg border border-secondary-200 bg-white">
				<Image
					src={currentImage.url}
					alt={currentImage.alt || productName}
					fill
					priority
					className="object-contain p-4 transition-transform duration-300"
					sizes="(max-width: 768px) 100vw, 50vw"
				/>

				{/* Navigation Arrows */}
				{secureImages.length > 1 && (
					<>
						<button
							onClick={goToPrevious}
							className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100"
							aria-label="Previous image"
						>
							<ChevronLeft className="h-5 w-5 text-secondary-700" />
						</button>
						<button
							onClick={goToNext}
							className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100"
							aria-label="Next image"
						>
							<ChevronRight className="h-5 w-5 text-secondary-700" />
						</button>
					</>
				)}

				{/* Zoom Button */}
				{enableZoom && (
					<button
						onClick={openZoomModal}
						className="absolute bottom-4 right-4 rounded-full bg-white/90 p-2 opacity-0 shadow-md transition-opacity hover:bg-white group-hover:opacity-100"
						aria-label="Zoom image"
					>
						<ZoomIn className="h-5 w-5 text-secondary-700" />
					</button>
				)}

				{/* Image Counter */}
				{secureImages.length > 1 && (
					<div className="absolute bottom-4 left-4 rounded bg-black/50 px-2 py-1 text-xs text-white">
						{selectedIndex + 1} / {secureImages.length}
					</div>
				)}
			</div>

			{/* Thumbnails */}
			{secureImages.length > 1 && (
				<div className="flex gap-2 overflow-x-auto pb-2">
					{secureImages.map((image, index) => (
						<button
							key={index}
							onClick={() => setSelectedIndex(index)}
							className={clsx(
								"relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 bg-white transition-colors md:h-20 md:w-20",
								index === selectedIndex
									? "border-primary-500"
									: "border-secondary-200 hover:border-secondary-400",
							)}
							aria-label={`View image ${index + 1}`}
							aria-current={index === selectedIndex}
						>
							<Image
								src={image.url}
								alt={image.alt || `${productName} thumbnail ${index + 1}`}
								fill
								className="object-contain p-1"
								sizes="80px"
							/>
						</button>
					))}
				</div>
			)}

			{/* Zoom Modal with Pan */}
			{isZoomed && enableZoom && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
					onClick={closeZoomModal}
				>
					{/* Controls */}
					<div className="absolute right-4 top-4 z-10 flex gap-2">
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleZoomOut();
							}}
							className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20 disabled:opacity-50"
							aria-label="Zoom out"
							disabled={zoomLevel <= 1}
						>
							<ZoomOut className="h-6 w-6 text-white" />
						</button>
						<span className="flex items-center rounded-full bg-white/10 px-3 text-sm text-white">
							{Math.round(zoomLevel * 100)}%
						</span>
						<button
							onClick={(e) => {
								e.stopPropagation();
								handleZoomIn();
							}}
							className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20 disabled:opacity-50"
							aria-label="Zoom in"
							disabled={zoomLevel >= 3}
						>
							<ZoomIn className="h-6 w-6 text-white" />
						</button>
						<button
							onClick={closeZoomModal}
							className="ml-2 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
							aria-label="Close zoom"
						>
							<X className="h-6 w-6 text-white" />
						</button>
					</div>

					{/* Zoom instructions */}
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
						{zoomLevel > 1
							? "Drag to pan • Click outside to close"
							: "Use +/- to zoom • Click outside to close"}
					</div>

					{/* Navigation in Zoom */}
					{secureImages.length > 1 && (
						<>
							<button
								onClick={(e) => {
									e.stopPropagation();
									goToPrevious();
									resetZoom();
								}}
								className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20"
								aria-label="Previous image"
							>
								<ChevronLeft className="h-8 w-8 text-white" />
							</button>
							<button
								onClick={(e) => {
									e.stopPropagation();
									goToNext();
									resetZoom();
								}}
								className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20"
								aria-label="Next image"
							>
								<ChevronRight className="h-8 w-8 text-white" />
							</button>
						</>
					)}

					{/* Zoomable Image */}
					<div
						ref={imageRef}
						className={clsx(
							"relative m-4 h-full max-h-[85vh] w-full max-w-5xl",
							zoomLevel > 1 ? "cursor-grab" : "cursor-zoom-in",
							isDragging && "cursor-grabbing",
						)}
						onClick={(e) => {
							e.stopPropagation();
							if (zoomLevel === 1) {
								handleZoomIn();
							}
						}}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
					>
						<div
							className="relative h-full w-full transition-transform duration-100"
							style={{
								transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${
									position.y / zoomLevel
								}px)`,
							}}
						>
							<Image
								src={currentImage.url}
								alt={currentImage.alt || productName}
								fill
								className="select-none object-contain"
								sizes="100vw"
								priority
								draggable={false}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
