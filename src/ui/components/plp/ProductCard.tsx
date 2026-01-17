"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/ui/components/ui/Button";
import { Badge } from "@/ui/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface ProductCardData {
	id: string;
	name: string;
	slug: string;
	brand?: string | null;
	price: number;
	compareAtPrice?: number | null;
	currency: string;
	image: string;
	imageAlt?: string;
	hoverImage?: string | null;
	href: string;
	badge?: "Sale" | "New" | null;
	colors?: { name: string; hex: string }[];
	/** Available sizes for filtering (e.g., ["S", "M", "L"]) */
	sizes?: string[];
	/** Category for filtering */
	category?: { id: string; name: string; slug: string } | null;
	/** ISO date string for "newest" sorting */
	createdAt?: string | null;
	/** Whether this product has variants requiring selection (no quick add) */
	hasVariants?: boolean;
	/** Callback for quick add - if provided and no variants, enables quick add */
	onQuickAdd?: (productId: string) => void;
}

interface ProductCardProps {
	product: ProductCardData;
	priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
	const canQuickAdd = !product.hasVariants && product.onQuickAdd;

	const handleQuickAdd = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		product.onQuickAdd?.(product.id);
	};

	const handleWishlist = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		// TODO: Implement wishlist functionality
	};

	const formatPrice = (amount: number, currency: string) => {
		return new Intl.NumberFormat("en", {
			style: "currency",
			currency: currency,
		}).format(amount);
	};

	return (
		<article className="group">
			<Link href={product.href} className="block">
				{/* Image Container */}
				<div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-xl bg-secondary">
					{/* Primary Image */}
					<Image
						src={product.image}
						alt={product.imageAlt || product.name}
						fill
						sizes="(max-width: 1024px) 50vw, 33vw"
						className={cn(
							"object-cover transition-all duration-500 ease-out group-hover:scale-105",
							product.hoverImage && "group-hover:opacity-0",
						)}
						priority={priority}
					/>

					{/* Hover Image */}
					{product.hoverImage && (
						<Image
							src={product.hoverImage}
							alt={`${product.name} - alternate view`}
							fill
							sizes="(max-width: 1024px) 50vw, 33vw"
							className="object-cover opacity-0 transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-100"
						/>
					)}

					{/* Badge */}
					{product.badge && (
						<Badge
							variant={product.badge === "Sale" ? "destructive" : "default"}
							className="absolute left-3 top-3"
						>
							{product.badge}
						</Badge>
					)}

					{/* Wishlist Button */}
					<Button
						variant="secondary"
						size="icon"
						className="absolute right-3 top-3 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
						onClick={handleWishlist}
						type="button"
					>
						<Heart className="h-4 w-4" />
						<span className="sr-only">Add to wishlist</span>
					</Button>

					{/* Quick Add Overlay */}
					{canQuickAdd && (
						<div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
							<Button className="w-full" size="sm" onClick={handleQuickAdd} type="button">
								<Plus className="mr-1.5 h-4 w-4" />
								Quick Add
							</Button>
						</div>
					)}
				</div>

				{/* Product Info */}
				<div className="space-y-1.5">
					{product.brand && <p className="text-xs tracking-wide text-muted-foreground">{product.brand}</p>}
					<h3 className="line-clamp-2 font-medium leading-snug underline-offset-2 group-hover:underline">
						{product.name}
					</h3>

					{/* Color Swatches */}
					{product.colors && product.colors.length > 1 && (
						<div className="flex items-center gap-1.5 pt-1">
							{product.colors.slice(0, 4).map((color) => (
								<span
									key={color.name}
									className="h-4 w-4 rounded-full border border-border"
									style={{ backgroundColor: color.hex }}
									title={color.name}
								/>
							))}
							{product.colors.length > 4 && (
								<span className="ml-0.5 text-xs text-muted-foreground">+{product.colors.length - 4}</span>
							)}
						</div>
					)}

					{/* Price */}
					<div className="flex items-center gap-2 pt-0.5">
						<span className="font-semibold">{formatPrice(product.price, product.currency)}</span>
						{product.compareAtPrice && (
							<span className="text-sm text-muted-foreground line-through">
								{formatPrice(product.compareAtPrice, product.currency)}
							</span>
						)}
					</div>
				</div>
			</Link>
		</article>
	);
}
