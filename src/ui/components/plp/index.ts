export { CategoryHero } from "./category-hero";
export { PageHeader } from "./page-header";
export { ProductCard, type ProductCardData } from "./product-card";
export { ProductCardWithQuickAdd } from "./product-card-with-quick-add";
export { ProductGrid } from "./product-grid";
export { ProductsGridSkeleton } from "./products-grid-skeleton";
export { PlpPageLoading } from "./plp-page-loading";
export {
	FilterBar,
	type SortOption,
	type FilterOption,
	type CategoryFilterOption,
	type ActiveFilter,
	type FilterLabelKey,
} from "./filter-bar";
export { WavePattern } from "./wave-pattern";
export { toProductCardData, transformToProductCard, formatPrice } from "./utils";
export {
	// Server-side filter helpers (resolveCategorySlugsToIds is in filter-utils.server.ts)
	buildFilterVariables,
	buildSortVariables,
	// Client-side filter helpers
	extractCategoryOptions,
	extractColorOptions,
	extractSizeOptions,
	filterProducts,
	sortProductsClientSide,
	buildActiveFilters,
	// Constants
	STATIC_PRICE_RANGES,
	STATIC_PRICE_RANGES_WITH_COUNT,
	// Types
	type CategoryOption,
} from "./filter-utils";
export { useProductFilters } from "./use-product-filters";
