"use client";

import { useCallback, useMemo, useOptimistic, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { parseFacetParam } from "@/config/facets";
import type { SortOption, ActiveFilter } from "./filter-bar";
import type { ProductCardData } from "./product-card-data";
import {
	extractColorOptions,
	extractSizeOptions,
	extractCategoryOptions,
	STATIC_PRICE_RANGES_WITH_COUNT,
	buildActiveFilters,
	sortProductsClientSide,
	type CategoryOption,
} from "./filter-utils";

interface UseProductFiltersOptions {
	products: ProductCardData[];
	/** Categories resolved from URL slugs (server-side) for active filter display */
	resolvedCategories?: Array<{ slug: string; id: string; name: string }>;
	/** Whether to include category filter (only for /products page) */
	enableCategoryFilter?: boolean;
	/** Server `products.totalCount` after filters — preferred for result count. */
	totalCount?: number;
}

interface UseProductFiltersResult {
	// Products from the server (already attribute-filtered); client only sorts as fallback
	filteredProducts: ProductCardData[];

	// Filter options for UI
	categoryOptions: CategoryOption[];
	colorOptions: Array<{ name: string; value?: string; count: number; hex?: string }>;
	sizeOptions: Array<{ name: string; value?: string; count: number }>;
	priceRanges: typeof STATIC_PRICE_RANGES_WITH_COUNT;

	// Selected filter values (optimistic while navigation is pending)
	selectedCategories: string[];
	selectedColors: string[];
	selectedSizes: string[];
	selectedPriceRange: string | null;
	sortValue: SortOption;

	/** True while a filter navigation is in flight */
	isPending: boolean;

	// Active filters for display
	activeFilters: ActiveFilter[];

	/** Prefer server totalCount when provided */
	resultCount: number;

	// Handlers
	handleCategoryToggle: (slug: string) => void;
	handleColorToggle: (color: string) => void;
	handleSizeToggle: (size: string) => void;
	handlePriceRangeChange: (range: string | null) => void;
	handleSortChange: (sort: SortOption) => void;
	handleRemoveFilter: (key: string, value: string) => void;
	handleClearFilters: () => void;
}

/**
 * Custom hook for product filtering and sorting logic.
 *
 * Server-side filters: categories, price, colors, sizes (URL → GraphQL)
 * Client: option lists from the current page sample + optimistic chip state
 */
export function useProductFilters({
	products,
	resolvedCategories = [],
	enableCategoryFilter = false,
	totalCount,
}: UseProductFiltersOptions): UseProductFiltersResult {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const urlCategories = useMemo(
		() => (enableCategoryFilter ? searchParams.get("categories")?.split(",").filter(Boolean) || [] : []),
		[searchParams, enableCategoryFilter],
	);
	const urlColors = useMemo(() => parseFacetParam(searchParams.get("colors")), [searchParams]);
	const urlSizes = useMemo(() => parseFacetParam(searchParams.get("sizes")), [searchParams]);
	const urlPriceRange = searchParams.get("price") || null;
	const sortValue = (searchParams.get("sort") as SortOption) || "featured";

	const [optimisticCategories, setOptimisticCategories] = useOptimistic(urlCategories);
	const [optimisticColors, setOptimisticColors] = useOptimistic(urlColors);
	const [optimisticSizes, setOptimisticSizes] = useOptimistic(urlSizes);
	const [optimisticPriceRange, setOptimisticPriceRange] = useOptimistic(urlPriceRange);

	const selectedCategories = enableCategoryFilter ? optimisticCategories : [];
	const selectedColors = optimisticColors;
	const selectedSizes = optimisticSizes;
	const selectedPriceRange = optimisticPriceRange;

	const updateFilters = useCallback(
		(updates: {
			categories?: string[];
			colors?: string[];
			sizes?: string[];
			price?: string | null;
			sort?: string;
		}) => {
			const params = new URLSearchParams(searchParams.toString());

			if (updates.categories !== undefined) {
				if (updates.categories.length > 0) {
					params.set("categories", updates.categories.join(","));
				} else {
					params.delete("categories");
				}
			}

			if (updates.colors !== undefined) {
				if (updates.colors.length > 0) {
					params.set("colors", [...updates.colors].sort().join(","));
				} else {
					params.delete("colors");
				}
			}

			if (updates.sizes !== undefined) {
				if (updates.sizes.length > 0) {
					params.set("sizes", [...updates.sizes].sort().join(","));
				} else {
					params.delete("sizes");
				}
			}

			if (updates.price !== undefined) {
				if (updates.price) {
					params.set("price", updates.price);
				} else {
					params.delete("price");
				}
			}

			if (updates.sort !== undefined) {
				if (updates.sort && updates.sort !== "featured") {
					params.set("sort", updates.sort);
				} else {
					params.delete("sort");
				}
			}

			// Drop pagination cursor when filters change so results start from page 1
			if (
				updates.categories !== undefined ||
				updates.colors !== undefined ||
				updates.sizes !== undefined ||
				updates.price !== undefined
			) {
				params.delete("cursor");
				params.delete("direction");
			}

			const queryString = params.toString();
			startTransition(() => {
				if (updates.categories !== undefined) setOptimisticCategories(updates.categories);
				if (updates.colors !== undefined) setOptimisticColors(updates.colors);
				if (updates.sizes !== undefined) setOptimisticSizes(updates.sizes);
				if (updates.price !== undefined) setOptimisticPriceRange(updates.price);
				router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
			});
		},
		[
			router,
			pathname,
			searchParams,
			startTransition,
			setOptimisticCategories,
			setOptimisticColors,
			setOptimisticSizes,
			setOptimisticPriceRange,
		],
	);

	const handleCategoryToggle = useCallback(
		(slug: string) => {
			const newCategories = selectedCategories.includes(slug)
				? selectedCategories.filter((c) => c !== slug)
				: [...selectedCategories, slug];
			updateFilters({ categories: newCategories });
		},
		[selectedCategories, updateFilters],
	);

	const handleColorToggle = useCallback(
		(color: string) => {
			const newColors = selectedColors.includes(color)
				? selectedColors.filter((c) => c !== color)
				: [...selectedColors, color];
			updateFilters({ colors: newColors });
		},
		[selectedColors, updateFilters],
	);

	const handleSizeToggle = useCallback(
		(size: string) => {
			const newSizes = selectedSizes.includes(size)
				? selectedSizes.filter((s) => s !== size)
				: [...selectedSizes, size];
			updateFilters({ sizes: newSizes });
		},
		[selectedSizes, updateFilters],
	);

	const handlePriceRangeChange = useCallback(
		(range: string | null) => {
			updateFilters({ price: range });
		},
		[updateFilters],
	);

	const handleSortChange = useCallback(
		(sort: SortOption) => {
			updateFilters({ sort });
		},
		[updateFilters],
	);

	const categoryOptions = useMemo(() => extractCategoryOptions(products), [products]);

	const handleRemoveFilter = useCallback(
		(key: string, value: string) => {
			if (key === "category") {
				const category =
					resolvedCategories.find((c) => c.name === value) || categoryOptions.find((c) => c.name === value);
				if (category) {
					const newCategories = selectedCategories.filter((c) => c !== category.slug);
					updateFilters({ categories: newCategories });
				}
			} else if (key === "color") {
				updateFilters({ colors: selectedColors.filter((c) => c !== value) });
			} else if (key === "size") {
				updateFilters({ sizes: selectedSizes.filter((s) => s !== value) });
			} else if (key === "price") {
				updateFilters({ price: null });
			}
		},
		[resolvedCategories, categoryOptions, selectedCategories, selectedColors, selectedSizes, updateFilters],
	);

	const handleClearFilters = useCallback(() => {
		startTransition(() => {
			setOptimisticCategories([]);
			setOptimisticColors([]);
			setOptimisticSizes([]);
			setOptimisticPriceRange(null);
			router.push(pathname, { scroll: false });
		});
	}, [
		router,
		pathname,
		startTransition,
		setOptimisticCategories,
		setOptimisticColors,
		setOptimisticSizes,
		setOptimisticPriceRange,
	]);

	const colorOptions = useMemo(
		() => extractColorOptions(products, selectedColors),
		[products, selectedColors],
	);
	const sizeOptions = useMemo(() => extractSizeOptions(products, selectedSizes), [products, selectedSizes]);

	// Server already applied attribute/category/price filters — only sort as a fallback
	const filteredProducts = useMemo(() => sortProductsClientSide(products, sortValue), [products, sortValue]);

	const colorLabels = useMemo(() => {
		const map: Record<string, string> = {};
		for (const opt of colorOptions) {
			const value = opt.value ?? opt.name;
			map[value] = opt.name;
		}
		return map;
	}, [colorOptions]);

	const sizeLabels = useMemo(() => {
		const map: Record<string, string> = {};
		for (const opt of sizeOptions) {
			const value = opt.value ?? opt.name;
			map[value] = opt.name;
		}
		return map;
	}, [sizeOptions]);

	const activeFilters = useMemo(() => {
		const filters = buildActiveFilters({
			colors: selectedColors,
			sizes: selectedSizes,
			priceRange: selectedPriceRange,
			colorLabels,
			sizeLabels,
		});

		resolvedCategories.forEach((cat) => {
			filters.unshift({ key: "category", label: "Category", value: cat.name });
		});

		return filters;
	}, [selectedColors, selectedSizes, selectedPriceRange, resolvedCategories, colorLabels, sizeLabels]);

	const resultCount = totalCount ?? filteredProducts.length;

	return {
		filteredProducts,
		categoryOptions,
		colorOptions,
		sizeOptions,
		priceRanges: STATIC_PRICE_RANGES_WITH_COUNT,
		selectedCategories,
		selectedColors,
		selectedSizes,
		selectedPriceRange,
		sortValue,
		isPending,
		activeFilters,
		resultCount,
		handleCategoryToggle,
		handleColorToggle,
		handleSizeToggle,
		handlePriceRangeChange,
		handleSortChange,
		handleRemoveFilter,
		handleClearFilters,
	};
}
