"use client";

import { Suspense } from "react";
import { Pagination } from "@/ui/components/pagination";
import type { ListingPageInfo, ListingSurface } from "@/lib/catalog/listing-query";
import { cn } from "@/lib/utils";
import { FilterBar } from "./filter-bar";
import {
	extractCategoryOptions,
	extractColorOptions,
	extractSizeOptions,
	STATIC_PRICE_RANGES_WITH_COUNT,
} from "./filter-utils";
import { PlpEmptyFilterResults } from "./plp-empty-filter-results";
import type { ProductCardData } from "./product-card-data";
import { ProductGrid } from "./product-grid";
import { ProductsGridSkeleton } from "./products-grid-skeleton";
import { useListingQuery } from "./use-listing-query";
import { useProductFilters } from "./use-product-filters";

export type PlpListingClientProps = {
	surface: ListingSurface;
	locale: string;
	channel: string;
	slug?: string;
	products: ProductCardData[];
	pageInfo: ListingPageInfo;
	totalCount: number;
	enableCategoryFilter?: boolean;
};

function PaginationSkeleton() {
	return (
		<nav className="flex items-center justify-center gap-x-4 px-4 pt-12">
			<span className="h-10 w-24 animate-pulse rounded-md bg-muted" />
			<span className="h-10 w-24 animate-pulse rounded-md bg-muted" />
		</nav>
	);
}

/**
 * Prerender / `useSearchParams` bailout: real first-page grid, no URL hooks.
 * Keeps canonical listing HTML on the CDN instead of a pulse skeleton.
 */
function PlpListingStatic({
	products,
	totalCount,
	enableCategoryFilter,
}: {
	products: ProductCardData[];
	totalCount: number;
	enableCategoryFilter: boolean;
}) {
	return (
		<>
			<FilterBar
				resultCount={totalCount}
				sortValue="featured"
				onSortChange={() => undefined}
				categoryOptions={enableCategoryFilter ? extractCategoryOptions(products) : undefined}
				colorOptions={extractColorOptions(products, [])}
				sizeOptions={extractSizeOptions(products, [])}
				priceRanges={STATIC_PRICE_RANGES_WITH_COUNT}
			/>
			<div className="w-full">
				<div className="container-content py-8">
					{products.length === 0 ? (
						<PlpEmptyFilterResults onClear={() => undefined} />
					) : (
						<ProductGrid products={products} />
					)}
				</div>
			</div>
		</>
	);
}

function PlpListingInteractive({
	surface,
	locale,
	channel,
	slug,
	products,
	pageInfo,
	totalCount,
	enableCategoryFilter,
}: PlpListingClientProps & { enableCategoryFilter: boolean }) {
	const listing = useListingQuery({
		surface,
		locale,
		channel,
		slug,
		initialProducts: products,
		initialPageInfo: pageInfo,
		initialTotalCount: totalCount,
	});

	const {
		filteredProducts,
		categoryOptions,
		colorOptions,
		sizeOptions,
		priceRanges,
		selectedCategories,
		selectedColors,
		selectedSizes,
		selectedPriceRange,
		sortValue,
		activeFilters,
		resultCount,
		isPending,
		handleCategoryToggle,
		handleColorToggle,
		handleSizeToggle,
		handlePriceRangeChange,
		handleSortChange,
		handleRemoveFilter,
		handleClearFilters,
	} = useProductFilters({
		products: listing.pending ? products : listing.products,
		resolvedCategories: listing.resolvedCategories,
		enableCategoryFilter,
		totalCount: listing.pending ? totalCount : listing.totalCount,
	});

	return (
		<>
			<FilterBar
				resultCount={listing.pending ? resultCount : listing.totalCount}
				sortValue={sortValue}
				onSortChange={handleSortChange}
				categoryOptions={enableCategoryFilter ? categoryOptions : undefined}
				colorOptions={colorOptions}
				sizeOptions={sizeOptions}
				priceRanges={priceRanges}
				selectedCategories={selectedCategories}
				selectedColors={selectedColors}
				selectedSizes={selectedSizes}
				selectedPriceRange={selectedPriceRange}
				onCategoryToggle={enableCategoryFilter ? handleCategoryToggle : undefined}
				onColorToggle={handleColorToggle}
				onSizeToggle={handleSizeToggle}
				onPriceRangeChange={handlePriceRangeChange}
				activeFilters={activeFilters}
				onRemoveFilter={handleRemoveFilter}
				onClearFilters={handleClearFilters}
			/>
			<div className={cn("w-full transition-opacity", (isPending || listing.pending) && "opacity-60")}>
				<div className="container-content py-8">
					{listing.pending ? (
						<ProductsGridSkeleton className="px-0 py-0" />
					) : listing.error || filteredProducts.length === 0 ? (
						<PlpEmptyFilterResults onClear={handleClearFilters} />
					) : (
						<ProductGrid products={filteredProducts} />
					)}
					{listing.pending ? null : (
						<Suspense fallback={<PaginationSkeleton />}>
							<Pagination pageInfo={listing.pageInfo} />
						</Suspense>
					)}
				</div>
			</div>
		</>
	);
}

export function PlpListingClient({ enableCategoryFilter = false, ...props }: PlpListingClientProps) {
	return (
		<Suspense
			fallback={
				<PlpListingStatic
					products={props.products}
					totalCount={props.totalCount}
					enableCategoryFilter={enableCategoryFilter}
				/>
			}
		>
			<PlpListingInteractive {...props} enableCategoryFilter={enableCategoryFilter} />
		</Suspense>
	);
}
