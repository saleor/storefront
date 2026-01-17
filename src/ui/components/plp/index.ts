export { CategoryHero } from "./CategoryHero";
export { PageHeader } from "./PageHeader";
export { ProductCard, type ProductCardData } from "./ProductCard";
export { ProductGrid } from "./ProductGrid";
export {
	FilterBar,
	type SortOption,
	type FilterOption,
	type CategoryFilterOption,
	type ActiveFilter,
} from "./FilterBar";
export { WavePattern } from "./WavePattern";
export { transformToProductCard, formatPrice } from "./utils";
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
export { useProductFilters } from "./useProductFilters";
