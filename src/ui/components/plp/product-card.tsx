"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import { Badge } from "@/ui/components/ui/badge";
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

	const formatPrice = (amount: number, currency: string) => {
		return new Intl.NumberFormat("en", {
			style: "currency",
			currency: currency,
		}).format(amount);
	};

	return (
		<article className="group">
			<Link href={product.href} className="block">
				{/* Card shell */}
				<div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-neutral-800/60 to-neutral-900/80 shadow-lg shadow-black/20 transition-all duration-500 hover:-translate-y-1 hover:border-emerald-500/15 hover:shadow-xl hover:shadow-emerald-900/20">
					{/* Image Container */}
					<div className="relative aspect-[3/4] overflow-hidden bg-neutral-800/40">
						<Image
							src={product.image}
							alt={product.imageAlt || product.name}
							fill
							sizes="(max-width: 1024px) 50vw, 33vw"
							className={cn(
								"object-cover transition-all duration-500 ease-out md:group-hover:scale-105",
								product.hoverImage && "md:group-hover:opacity-0",
							)}
							priority={priority}
						/>

						{product.hoverImage && (
							<Image
								src={product.hoverImage}
								alt={`${product.name} - alternate view`}
								fill
								sizes="(max-width: 1024px) 50vw, 33vw"
								className="object-cover opacity-0 transition-all duration-500 ease-out md:group-hover:scale-105 md:group-hover:opacity-100"
							/>
						)}

						{product.badge && (
							<Badge
								variant={product.badge === "Sale" ? "destructive" : "default"}
								className="absolute left-3 top-3"
							>
								{product.badge}
							</Badge>
						)}

						{canQuickAdd && (
							<div className="absolute bottom-0 left-0 right-0 hidden translate-y-2 p-3 opacity-0 transition-all duration-300 md:block md:group-hover:translate-y-0 md:group-hover:opacity-100">
								<Button
									className="w-full bg-emerald-500 text-white hover:bg-emerald-400"
									size="sm"
									onClick={handleQuickAdd}
									type="button"
								>
									<Plus className="mr-1.5 h-4 w-4" />
									Quick Add
								</Button>
							</div>
						)}
					</div>

					{/* Product Info */}
					<div className="border-t border-white/[0.05] px-4 py-4">
						{product.brand && (
							<p className="mb-1 text-xs font-medium uppercase tracking-wider text-emerald-400/80">
								{product.brand}
							</p>
						)}
						<h3 className="line-clamp-2 text-sm font-medium leading-snug text-neutral-200 transition-colors md:group-hover:text-white">
							{product.name}
						</h3>

						{product.colors && product.colors.length > 1 && (
							<div className="mt-2 flex items-center gap-1.5">
								{product.colors.slice(0, 4).map((color) => (
									<span
										key={color.name}
										className="h-3.5 w-3.5 rounded-full border border-white/10"
										style={{ backgroundColor: color.hex }}
										title={color.name}
									/>
								))}
								{product.colors.length > 4 && (
									<span className="ml-0.5 text-xs text-neutral-500">+{product.colors.length - 4}</span>
								)}
							</div>
						)}

						<div className="mt-2 flex items-center gap-2">
							<span className="font-semibold text-white">{formatPrice(product.price, product.currency)}</span>
							{product.compareAtPrice && (
								<span className="text-sm text-neutral-500 line-through">
									{formatPrice(product.compareAtPrice, product.currency)}
								</span>
							)}
						</div>
					</div>
				</div>
			</Link>
		</article>
	);
}
