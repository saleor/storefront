"use client";

import { Suspense } from "react";
import { FilterBar, ProductGrid, useProductFilters, type ProductCardData } from "@/ui/components/plp";
import { Pagination } from "@/ui/components/pagination";

interface ProductsPageClientProps {
	products: ProductCardData[];
	pageInfo: {
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor?: string | null;
		endCursor?: string | null;
	};
	totalCount?: number;
	/** Categories resolved from URL slugs (server-side) for active filter display */
	resolvedCategories?: Array<{ slug: string; id: string; name: string }>;
}

function PaginationSkeleton() {
	return (
		<nav className="flex items-center justify-center gap-x-4 px-4 pt-12">
			<span className="h-10 w-24 animate-pulse rounded bg-neutral-800" />
			<span className="h-10 w-24 animate-pulse rounded bg-neutral-800" />
		</nav>
	);
}

export function ProductsPageClient({ products, pageInfo, resolvedCategories = [] }: ProductsPageClientProps) {
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
		handleCategoryToggle,
		handleColorToggle,
		handleSizeToggle,
		handlePriceRangeChange,
		handleSortChange,
		handleRemoveFilter,
		handleClearFilters,
	} = useProductFilters({
		products,
		resolvedCategories,
		enableCategoryFilter: true,
	});

	return (
		<div className="min-h-screen bg-neutral-950">
			<FilterBar
				resultCount={filteredProducts.length}
				sortValue={sortValue}
				onSortChange={handleSortChange}
				categoryOptions={categoryOptions}
				colorOptions={colorOptions}
				sizeOptions={sizeOptions}
				priceRanges={priceRanges}
				selectedCategories={selectedCategories}
				selectedColors={selectedColors}
				selectedSizes={selectedSizes}
				selectedPriceRange={selectedPriceRange}
				onCategoryToggle={handleCategoryToggle}
				onColorToggle={handleColorToggle}
				onSizeToggle={handleSizeToggle}
				onPriceRangeChange={handlePriceRangeChange}
				activeFilters={activeFilters}
				onRemoveFilter={handleRemoveFilter}
				onClearFilters={handleClearFilters}
			/>
			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
				{filteredProducts.length > 0 ? (
					<ProductGrid products={filteredProducts} />
				) : (
					<div className="py-20 text-center">
						<p className="text-lg text-neutral-400">No products match your filters.</p>
						<button
							onClick={handleClearFilters}
							className="mt-4 text-sm font-medium text-emerald-400 underline underline-offset-4 transition-colors hover:text-emerald-300"
						>
							Clear all filters
						</button>
					</div>
				)}
				<Suspense fallback={<PaginationSkeleton />}>
					<Pagination pageInfo={pageInfo} />
				</Suspense>
			</div>
		</div>
	);
}
