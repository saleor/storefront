"use client";

import { Suspense } from "react";
import {
	FilterBar,
	ProductGrid,
	PlpEmptyFilterResults,
	useProductFilters,
	type ProductCardData,
} from "@/ui/components/plp";
import { Pagination } from "@/ui/components/pagination";
import { cn } from "@/lib/utils";

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
			<span className="h-10 w-24 animate-pulse rounded-md bg-muted" />
			<span className="h-10 w-24 animate-pulse rounded-md bg-muted" />
		</nav>
	);
}

export function ProductsPageClient({
	products,
	pageInfo,
	totalCount,
	resolvedCategories = [],
}: ProductsPageClientProps) {
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
		products,
		resolvedCategories,
		enableCategoryFilter: true,
		totalCount,
	});

	return (
		<>
			<FilterBar
				resultCount={resultCount}
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
			<div className={cn("w-full transition-opacity", isPending && "opacity-60")}>
				<div className="container-content py-8">
					{filteredProducts.length > 0 ? (
						<ProductGrid products={filteredProducts} />
					) : (
						<PlpEmptyFilterResults onClear={handleClearFilters} />
					)}
					<Suspense fallback={<PaginationSkeleton />}>
						<Pagination pageInfo={pageInfo} />
					</Suspense>
				</div>
			</div>
		</>
	);
}
