"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { WishlistButton } from "./WishlistButton";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange, ensureHttps } from "@/lib/utils";

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
	// Ensure all URLs use HTTPS to avoid mixed content warnings
	const images =
		mediaImages.length > 0
			? mediaImages.map((m) => ({ url: ensureHttps(m.url), alt: m.alt }))
			: product.thumbnail
				? [{ url: ensureHttps(product.thumbnail.url), alt: product.thumbnail.alt }]
				: [];

	const hasMultipleImages = images.length > 1;

	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isHovering, setIsHovering] = useState(false);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Auto-slideshow continuously for all products with multiple images
	useEffect(() => {
		if (hasMultipleImages) {
			// Stagger start time based on product id to avoid all products changing at once
			const staggerDelay = (product.id.charCodeAt(0) % 10) * 200;

			const startSlideshow = () => {
				intervalRef.current = setInterval(() => {
					setCurrentImageIndex((prev) => (prev + 1) % images.length);
				}, 3000); // Change image every 3 seconds
			};

			const timeoutId = setTimeout(startSlideshow, staggerDelay);

			return () => {
				clearTimeout(timeoutId);
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
			};
		}
	}, [hasMultipleImages, images.length, product.id]);

	const goToPrevious = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
		},
		[images.length],
	);

	const goToNext = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
		},
		[images.length],
	);

	// Get current image URL (ensure HTTPS)
	const currentImage = images[currentImageIndex]?.url || ensureHttps(product.thumbnail?.url);
	const currentAlt = images[currentImageIndex]?.alt || product.thumbnail?.alt || product.name;

	// Debug: log image count (remove in production)
	// console.log(`Product ${product.name}: ${images.length} images, hasMultiple: ${hasMultipleImages}`);

	if (variant === "list") {
		return (
			<li data-testid="ProductElement" className="group">
				<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
					<div className="flex gap-4 rounded-lg border border-secondary-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-md">
						<div
							className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md bg-white"
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
								<div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-1">
									{images.slice(0, 5).map((_, idx) => (
										<span
											key={idx}
											className={clsx(
												"h-1 w-1 rounded-full transition-colors",
												idx === currentImageIndex ? "bg-primary-500" : "bg-secondary-300",
											)}
										/>
									))}
								</div>
							)}
						</div>
						<div className="flex flex-1 flex-col justify-between">
							<div>
								<p
									className="text-xs uppercase tracking-wide text-secondary-500"
									data-testid="ProductElement_Category"
								>
									{product.category?.name}
								</p>
								<h3 className="mt-1 text-base font-semibold text-secondary-900 transition-colors group-hover:text-primary-600">
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
								{showWishlist && <WishlistButton product={product} size="sm" />}
							</div>
						</div>
					</div>
				</LinkWithChannel>
			</li>
		);
	}

	// Check if product is on sale
	const isOnSale = product.pricing?.onSale;
	const originalPrice = product.pricing?.priceRangeUndiscounted?.start?.gross;
	const currentPriceAmount = product.pricing?.priceRange?.start?.gross;
	const discountPercentage =
		isOnSale && originalPrice && currentPriceAmount
			? Math.round((1 - currentPriceAmount.amount / originalPrice.amount) * 100)
			: 0;

	return (
		<li data-testid="ProductElement" className="group relative">
			<div className="relative overflow-hidden rounded-lg border border-secondary-200 bg-white transition-all hover:border-primary-300 hover:shadow-lg">
				{/* Sale Badge */}
				{isOnSale && discountPercentage > 0 && (
					<div className="absolute left-3 top-3 z-20 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
						-{discountPercentage}%
					</div>
				)}

				{/* Product Image with Slideshow */}
				<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
					<div
						className="relative aspect-square overflow-hidden bg-white"
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
									className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow-md transition-colors hover:bg-white"
									aria-label="Previous image"
								>
									<ChevronLeft className="h-4 w-4 text-secondary-700" />
								</button>
								<button
									onClick={goToNext}
									className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow-md transition-colors hover:bg-white"
									aria-label="Next image"
								>
									<ChevronRight className="h-4 w-4 text-secondary-700" />
								</button>
							</>
						)}

						{/* Image dots indicator */}
						{hasMultipleImages && (
							<div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
								{images.slice(0, 5).map((_, idx) => (
									<button
										key={idx}
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setCurrentImageIndex(idx);
										}}
										className={clsx(
											"h-2 w-2 rounded-full transition-all",
											idx === currentImageIndex
												? "scale-110 bg-primary-500"
												: "bg-secondary-300 hover:bg-secondary-400",
										)}
										aria-label={`View image ${idx + 1}`}
									/>
								))}
								{images.length > 5 && (
									<span className="ml-1 text-xs text-secondary-500">+{images.length - 5}</span>
								)}
							</div>
						)}
					</div>
				</LinkWithChannel>

				{/* Quick Actions */}
				{(showWishlist || showQuickView) && (
					<div className="absolute right-3 top-3 z-20 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
						{showWishlist && <WishlistButton product={product} size="sm" />}
						{showQuickView && (
							<button
								className="rounded-full bg-white p-2 shadow-md transition-colors hover:bg-primary-50 hover:text-primary-600"
								aria-label="Quick view"
							>
								<Eye className="h-4 w-4" />
							</button>
						)}
					</div>
				)}

				{/* Product Info */}
				<div className="p-4">
					<p
						className="text-xs uppercase tracking-wide text-secondary-500"
						data-testid="ProductElement_Category"
					>
						{product.category?.name}
					</p>
					<LinkWithChannel href={`/products/${product.slug}`}>
						<h3 className="mt-1 line-clamp-2 text-sm font-semibold text-secondary-900 transition-colors group-hover:text-primary-600">
							{product.name}
						</h3>
					</LinkWithChannel>
					<div className="mt-2" data-testid="ProductElement_PriceRange">
						{isOnSale && originalPrice ? (
							<div className="flex items-center gap-2">
								<span className="text-base font-bold text-red-600">
									{formatMoneyRange({
										start: product?.pricing?.priceRange?.start?.gross,
										stop: product?.pricing?.priceRange?.stop?.gross,
									})}
								</span>
								<span className="text-sm text-secondary-400 line-through">
									{formatMoneyRange({
										start: originalPrice,
										stop: product?.pricing?.priceRangeUndiscounted?.stop?.gross,
									})}
								</span>
							</div>
						) : (
							<span className="text-base font-bold text-secondary-900">
								{formatMoneyRange({
									start: product?.pricing?.priceRange?.start?.gross,
									stop: product?.pricing?.priceRange?.stop?.gross,
								})}
							</span>
						)}
					</div>
				</div>
			</div>
		</li>
	);
}
