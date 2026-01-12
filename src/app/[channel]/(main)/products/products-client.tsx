"use client";

import { Suspense } from "react";
import { FilterBar, ProductGrid, useProductFilters, type ProductCardData } from "@/ui/components/plp";
import { Pagination } from "@/ui/components/Pagination";

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
		<nav className="flex items-center justify-center gap-x-4 border-neutral-200 px-4 pt-12">
			<span className="h-10 w-24 animate-pulse rounded bg-neutral-200" />
			<span className="h-10 w-24 animate-pulse rounded bg-neutral-200" />
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
		<>
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
			<div className="w-full">
				<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					{filteredProducts.length > 0 ? (
						<ProductGrid products={filteredProducts} />
					) : (
						<div className="py-12 text-center">
							<p className="text-lg text-muted-foreground">No products match your filters.</p>
							<button
								onClick={handleClearFilters}
								className="mt-4 text-sm font-medium text-foreground underline underline-offset-4"
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
		</>
	);
}
