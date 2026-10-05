"use client";

import { Suspense } from "react";
import { Pagination } from "@/ui/components/pagination";
import type { ListingPageInfo, ListingSurface } from "@/lib/catalog/listing-query";
import type { PlpFacetsPlacement } from "@/lib/storefront/templates";
import { cn } from "@/lib/utils";
import { FilterBar, type SortOption } from "./filter-bar";
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
	facetsPlacement?: PlpFacetsPlacement;
	initialViewKey?: string;
	providerId?: string;
	/** Sorts the active provider can apply. The bar always keeps `featured` as the default. */
	sorts?: readonly string[];
};

const BAR_SORTS = [
	"featured",
	"newest",
	"price_asc",
	"price_desc",
	"bestselling",
] as const satisfies readonly SortOption[];

function sortOptionsFor(sorts?: readonly string[]): readonly SortOption[] | undefined {
	if (!sorts) return undefined;
	const allowed = new Set(sorts);
	return BAR_SORTS.filter((option) => option === "featured" || allowed.has(option));
}

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
	sortOptions,
}: {
	products: ProductCardData[];
	totalCount: number;
	enableCategoryFilter: boolean;
	sortOptions?: readonly SortOption[];
}) {
	return (
		<>
			<FilterBar
				resultCount={totalCount}
				sortValue="featured"
				sortOptions={sortOptions}
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
	facetsPlacement = "bar",
	initialViewKey,
	providerId,
	sorts,
}: PlpListingClientProps & { enableCategoryFilter: boolean }) {
	const sortOptions = sortOptionsFor(sorts);
	const listing = useListingQuery({
		surface,
		locale,
		channel,
		slug,
		initialProducts: products,
		initialPageInfo: pageInfo,
		initialTotalCount: totalCount,
		initialViewKey,
		providerId,
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

	const sidebar = facetsPlacement === "sidebar";

	return (
		<div className={cn(sidebar && "container-content lg:flex lg:items-start lg:gap-10")}>
			<div className={cn(sidebar && "lg:sticky lg:top-24 lg:w-64 lg:shrink-0")}>
				<FilterBar
					resultCount={listing.pending ? resultCount : listing.totalCount}
					sortValue={sortValue}
					sortOptions={sortOptions}
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
			</div>
			<div className={cn("w-full transition-opacity", (isPending || listing.pending) && "opacity-60")}>
				<div className={cn(!sidebar && "container-content", "py-8")}>
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
		</div>
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
					sortOptions={sortOptionsFor(props.sorts)}
				/>
			}
		>
			<PlpListingInteractive {...props} enableCategoryFilter={enableCategoryFilter} />
		</Suspense>
	);
}
