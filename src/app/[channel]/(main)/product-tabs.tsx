"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { type ProductListItemFragment } from "@/gql/graphql";
import { LinkWithChannel } from "@/ui/atoms/link-with-channel";
import { ProductImageWrapper } from "@/ui/atoms/product-image-wrapper";
import { formatMoneyRange } from "@/lib/utils";

function ProductCard({ product, index }: { product: ProductListItemFragment; index: number }) {
	const startPrice = product.pricing?.priceRange?.start?.gross;
	const undiscounted = product.pricing?.priceRangeUndiscounted?.start?.gross;
	const hasDiscount = undiscounted && startPrice && undiscounted.amount !== startPrice.amount;

	return (
		<li className="card-lift group">
			<LinkWithChannel href={`/products/${product.slug}`} prefetch={false}>
				<div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 transition-colors duration-300 group-hover:border-neutral-700">
					{hasDiscount && (
						<div className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
							Sale
						</div>
					)}
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							loading={index < 4 ? "eager" : "lazy"}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							width={512}
							height={512}
							sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
							priority={index < 2}
							className="transition-transform duration-700 ease-out group-hover:scale-105"
						/>
					)}
				</div>
				<div className="mt-4 space-y-1 px-0.5">
					<p className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
						{product.category?.name}
					</p>
					<h3 className="text-sm font-semibold leading-snug text-neutral-200">{product.name}</h3>
					<div className="flex items-center gap-2 pt-1">
						<span className="text-sm font-bold text-white">
							{formatMoneyRange({
								start: startPrice,
								stop: product?.pricing?.priceRange?.stop?.gross,
							})}
						</span>
						{hasDiscount && (
							<span className="text-xs text-neutral-500 line-through">
								{formatMoneyRange({
									start: undiscounted,
									stop: product?.pricing?.priceRangeUndiscounted?.stop?.gross,
								})}
							</span>
						)}
					</div>
				</div>
			</LinkWithChannel>
		</li>
	);
}

const tabs = [
	{ key: "featured", label: "Featured" },
	{ key: "best-sellers", label: "Best Sellers" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function ProductTabs({
	featured,
	bestSellers,
}: {
	featured: ProductListItemFragment[];
	bestSellers: ProductListItemFragment[];
}) {
	const [activeTab, setActiveTab] = useState<TabKey>("featured");
	const products = activeTab === "featured" ? featured : bestSellers;

	return (
		<>
			<div className="mb-12 flex items-end justify-between sm:mb-16">
				<div>
					<p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-emerald-400">
						Our Compounds
					</p>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
						Research-Grade Peptides
					</h2>
					{/* Tabs */}
					<div className="mt-6 flex gap-4 sm:gap-6">
						{tabs.map((tab) => (
							<button
								key={tab.key}
								type="button"
								onClick={() => setActiveTab(tab.key)}
								className={cn(
									"min-h-11 border-b-2 px-1 pb-2 text-sm font-medium transition-colors",
									activeTab === tab.key
										? "border-emerald-500 text-white"
										: "border-transparent text-neutral-500 hover:text-neutral-300",
								)}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>
				<LinkWithChannel
					href="/products"
					className="hidden items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white sm:inline-flex"
				>
					View All
					<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
					</svg>
				</LinkWithChannel>
			</div>
			<ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
				{products.map((product, i) => (
					<ProductCard key={product.id} product={product} index={i} />
				))}
			</ul>
		</>
	);
}
