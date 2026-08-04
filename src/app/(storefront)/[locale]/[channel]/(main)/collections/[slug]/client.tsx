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

interface CollectionPageClientProps {
	products: ProductCardData[];
	pageInfo: {
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		startCursor?: string | null;
		endCursor?: string | null;
	};
	totalCount?: number;
}

function PaginationSkeleton() {
	return (
		<nav className="flex items-center justify-center gap-x-4 px-4 pt-12">
			<span className="h-10 w-24 animate-pulse rounded-md bg-muted" />
			<span className="h-10 w-24 animate-pulse rounded-md bg-muted" />
		</nav>
	);
}

export function CollectionPageClient({ products, pageInfo, totalCount }: CollectionPageClientProps) {
	const {
		filteredProducts,
		colorOptions,
		sizeOptions,
		priceRanges,
		selectedColors,
		selectedSizes,
		selectedPriceRange,
		sortValue,
		activeFilters,
		resultCount,
		isPending,
		handleColorToggle,
		handleSizeToggle,
		handlePriceRangeChange,
		handleSortChange,
		handleRemoveFilter,
		handleClearFilters,
	} = useProductFilters({ products, totalCount });

	return (
		<>
			<FilterBar
				resultCount={resultCount}
				sortValue={sortValue}
				onSortChange={handleSortChange}
				colorOptions={colorOptions}
				sizeOptions={sizeOptions}
				priceRanges={priceRanges}
				selectedColors={selectedColors}
				selectedSizes={selectedSizes}
				selectedPriceRange={selectedPriceRange}
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
