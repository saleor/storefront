"use client";

import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { WishlistButton } from "./WishlistButton";
import { Eye } from "lucide-react";

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
	if (variant === "list") {
		return (
			<li data-testid="ProductElement" className="group">
				<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
					<div className="flex gap-4 p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:shadow-md transition-all bg-white">
						<div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-md bg-white">
							{product?.thumbnail?.url && (
								<ProductImageWrapper
									loading={loading}
									src={product.thumbnail.url}
									alt={product.thumbnail.alt ?? ""}
									width={128}
									height={128}
									sizes={"128px"}
									priority={priority}
									objectFit="contain"
								/>
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
				{/* Product Image */}
				<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
					<div className="aspect-square overflow-hidden bg-white">
						{product?.thumbnail?.url && (
							<ProductImageWrapper
								loading={loading}
								src={product.thumbnail.url}
								alt={product.thumbnail.alt ?? ""}
								width={512}
								height={512}
								sizes={"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
								priority={priority}
								objectFit="contain"
								className="group-hover:scale-105 transition-transform duration-300"
							/>
						)}
					</div>
				</LinkWithChannel>

				{/* Quick Actions */}
				{(showWishlist || showQuickView) && (
					<div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
