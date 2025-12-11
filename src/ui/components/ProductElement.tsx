"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { WishlistButton } from "./WishlistButton";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/utils";

export interface ProductElementProps {
	product: ProductListItemFragment;
	loading: "eager" | "lazy";
	priority?: boolean;
	variant?: "grid" | "list";
	showWishlist?: boolean;
	showQuickView?: boolean;
}

export function ProductElement({
	product,
	loading,
	priority,
	variant = "grid",
	showWishlist = true,
	showQuickView = false,
}: ProductElementProps) {
	// Get all images (filter to only IMAGE type)
	const mediaImages = product.media?.filter((m) => m.type === "IMAGE") || [];
	
	// Build images array - use media if available, otherwise fall back to thumbnail
	const images = mediaImages.length > 0 
		? mediaImages.map(m => ({ url: m.url, alt: m.alt }))
		: product.thumbnail 
			? [{ url: product.thumbnail.url, alt: product.thumbnail.alt }]
			: [];
	
	const hasMultipleImages = images.length > 1;
	
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isHovering, setIsHovering] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Auto-slideshow on hover
	useEffect(() => {
		if (isHovering && hasMultipleImages) {
			intervalRef.current = setInterval(() => {
				setCurrentImageIndex((prev) => (prev + 1) % images.length);
			}, 1500); // Change image every 1.5 seconds
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			setCurrentImageIndex(0);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isHovering, hasMultipleImages, images.length]);

	const goToPrevious = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
	}, [images.length]);

	const goToNext = useCallback((e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
	}, [images.length]);

	// Get current image URL
	const currentImage = images[currentImageIndex]?.url || product.thumbnail?.url;
	const currentAlt = images[currentImageIndex]?.alt || product.thumbnail?.alt || product.name;
	
	// Debug: log image count (remove in production)
	// console.log(`Product ${product.name}: ${images.length} images, hasMultiple: ${hasMultipleImages}`);

	if (variant === "list") {
		return (
			<li data-testid="ProductElement" className="group">
				<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
					<div className="flex gap-4 p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:shadow-md transition-all bg-white">
						<div 
							className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-md bg-white"
							onMouseEnter={() => setIsHovering(true)}
							onMouseLeave={() => setIsHovering(false)}
						>
							{currentImage && (
								<Image
									src={currentImage}
									alt={currentAlt || ""}
									fill
									className="object-contain p-2 transition-opacity duration-300"
									sizes="128px"
									loading={loading}
									priority={priority}
								/>
							)}
							{/* Image dots indicator */}
							{hasMultipleImages && (
								<div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
									{images.slice(0, 5).map((_, idx) => (
										<span
											key={idx}
											className={clsx(
												"w-1 h-1 rounded-full transition-colors",
												idx === currentImageIndex ? "bg-primary-500" : "bg-secondary-300"
											)}
										/>
									))}
								</div>
							)}
						</div>
						<div className="flex-1 flex flex-col justify-between">
							<div>
								<p className="text-xs text-secondary-500 uppercase tracking-wide" data-testid="ProductElement_Category">
									{product.category?.name}
								</p>
								<h3 className="mt-1 text-base font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
									{product.name}
								</h3>
							</div>
							<div className="flex items-center justify-between">
								<p className="text-lg font-bold text-secondary-900" data-testid="ProductElement_PriceRange">
									{formatMoneyRange({
										start: product?.pricing?.priceRange?.start?.gross,
										stop: product?.pricing?.priceRange?.stop?.gross,
									})}
								</p>
								{showWishlist && (
									<WishlistButton product={product} size="sm" />
								)}
							</div>
						</div>
					</div>
				</LinkWithChannel>
			</li>
		);
	}

	return (
		<li data-testid="ProductElement" className="group relative">
			<div className="relative overflow-hidden rounded-lg bg-white border border-secondary-200 hover:border-primary-300 hover:shadow-lg transition-all">
				{/* Product Image with Slideshow */}
				<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
					<div 
						className="aspect-square overflow-hidden bg-white relative"
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}
					>
						{currentImage && (
							<Image
								src={currentImage}
								alt={currentAlt || ""}
								fill
								className="object-contain p-4 transition-all duration-300 group-hover:scale-105"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								loading={loading}
								priority={priority}
							/>
						)}

						{/* Navigation arrows (show on hover if multiple images) */}
						{hasMultipleImages && isHovering && (
							<>
								<button
									onClick={goToPrevious}
									className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors z-10"
									aria-label="Previous image"
								>
									<ChevronLeft className="h-4 w-4 text-secondary-700" />
								</button>
								<button
									onClick={goToNext}
									className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors z-10"
									aria-label="Next image"
								>
									<ChevronRight className="h-4 w-4 text-secondary-700" />
								</button>
							</>
						)}

						{/* Image dots indicator */}
						{hasMultipleImages && (
							<div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
								{images.slice(0, 5).map((_, idx) => (
									<button
										key={idx}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setCurrentImageIndex(idx);
										}}
										className={clsx(
											"w-2 h-2 rounded-full transition-all",
											idx === currentImageIndex 
												? "bg-primary-500 scale-110" 
												: "bg-secondary-300 hover:bg-secondary-400"
										)}
										aria-label={`View image ${idx + 1}`}
									/>
								))}
								{images.length > 5 && (
									<span className="text-xs text-secondary-500 ml-1">+{images.length - 5}</span>
								)}
							</div>
						)}
					</div>
				</LinkWithChannel>

				{/* Quick Actions */}
				{(showWishlist || showQuickView) && (
					<div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
						{showWishlist && (
							<WishlistButton product={product} size="sm" />
						)}
						{showQuickView && (
							<button 
								className="p-2 bg-white rounded-full shadow-md hover:bg-primary-50 hover:text-primary-600 transition-colors"
								aria-label="Quick view"
							>
								<Eye className="h-4 w-4" />
							</button>
						)}
					</div>
				)}

				{/* Product Info */}
				<div className="p-4">
					<p className="text-xs text-secondary-500 uppercase tracking-wide" data-testid="ProductElement_Category">
						{product.category?.name}
					</p>
					<LinkWithChannel href={`/products/${product.slug}`}>
						<h3 className="mt-1 text-sm font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
							{product.name}
						</h3>
					</LinkWithChannel>
					<p className="mt-2 text-base font-bold text-secondary-900" data-testid="ProductElement_PriceRange">
						{formatMoneyRange({
							start: product?.pricing?.priceRange?.start?.gross,
							stop: product?.pricing?.priceRange?.stop?.gross,
						})}
					</p>
				</div>
			</div>
		</li>
	);
}
