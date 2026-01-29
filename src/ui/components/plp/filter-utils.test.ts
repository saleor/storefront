import { describe, it, expect, vi } from "vitest";

// Mock the graphql module to avoid server-only imports
vi.mock("@/lib/graphql", () => ({
	executePublicGraphQL: vi.fn(),
}));

import {
	buildFilterVariables,
	buildSortVariables,
	extractCategoryOptions,
	extractColorOptions,
	extractSizeOptions,
	filterProducts,
	sortProductsClientSide,
	buildActiveFilters,
	STATIC_PRICE_RANGES,
	STATIC_PRICE_RANGES_WITH_COUNT,
} from "./filter-utils";
import {
	sampleProducts,
	productsWithoutCategories,
	productsWithStandardSizes,
} from "./__fixtures__/products";

// =============================================================================
// buildFilterVariables
// =============================================================================
describe("buildFilterVariables", () => {
	it("returns undefined when no filters provided", () => {
		expect(buildFilterVariables({})).toBeUndefined();
	});

	it("builds category filter from IDs", () => {
		const result = buildFilterVariables({ categoryIds: ["cat-1", "cat-2"] });
		expect(result).toEqual({ categories: ["cat-1", "cat-2"] });
	});

	it("builds price range filter with min and max", () => {
		const result = buildFilterVariables({ priceRange: "50-100" });
		expect(result).toEqual({ price: { gte: 50, lte: 100 } });
	});

	it("builds price range filter with min only (open-ended)", () => {
		const result = buildFilterVariables({ priceRange: "200-" });
		expect(result).toEqual({ price: { gte: 200 } });
	});

	it("builds price range filter with 0 min", () => {
		const result = buildFilterVariables({ priceRange: "0-50" });
		expect(result).toEqual({ price: { gte: 0, lte: 50 } });
	});

	it("combines category and price filters", () => {
		const result = buildFilterVariables({
			categoryIds: ["cat-1"],
			priceRange: "50-100",
		});
		expect(result).toEqual({
			categories: ["cat-1"],
			price: { gte: 50, lte: 100 },
		});
	});

	it("ignores null priceRange", () => {
		const result = buildFilterVariables({ priceRange: null });
		expect(result).toBeUndefined();
	});

	it("ignores empty categoryIds array", () => {
		const result = buildFilterVariables({ categoryIds: [] });
		expect(result).toBeUndefined();
	});
});

// =============================================================================
// buildSortVariables
// =============================================================================
describe("buildSortVariables", () => {
	it("returns undefined for 'featured' sort", () => {
		expect(buildSortVariables("featured")).toBeUndefined();
	});

	it("returns undefined for undefined sort", () => {
		expect(buildSortVariables(undefined)).toBeUndefined();
	});

	it("returns DATE DESC for 'newest'", () => {
		expect(buildSortVariables("newest")).toEqual({
			field: "DATE",
			direction: "DESC",
		});
	});

	it("returns PRICE ASC for 'price_asc'", () => {
		expect(buildSortVariables("price_asc")).toEqual({
			field: "PRICE",
			direction: "ASC",
		});
	});

	it("returns PRICE DESC for 'price_desc'", () => {
		expect(buildSortVariables("price_desc")).toEqual({
			field: "PRICE",
			direction: "DESC",
		});
	});

	it("returns RATING DESC for 'bestselling'", () => {
		expect(buildSortVariables("bestselling")).toEqual({
			field: "RATING",
			direction: "DESC",
		});
	});

	it("returns undefined for unknown sort option", () => {
		expect(buildSortVariables("unknown")).toBeUndefined();
	});
});

// =============================================================================
// extractCategoryOptions
// =============================================================================
describe("extractCategoryOptions", () => {
	it("extracts unique categories with counts", () => {
		const result = extractCategoryOptions(sampleProducts);

		expect(result).toHaveLength(4); // T-Shirts, Jeans, Sneakers, Hoodies
		expect(result.find((c) => c.slug === "t-shirts")?.count).toBe(2);
		expect(result.find((c) => c.slug === "jeans")?.count).toBe(1);
	});

	it("sorts by count descending", () => {
		const result = extractCategoryOptions(sampleProducts);

		// T-Shirts has 2 products, should be first
		expect(result[0].slug).toBe("t-shirts");
		expect(result[0].count).toBe(2);
	});

	it("returns empty array for products without categories", () => {
		const result = extractCategoryOptions(productsWithoutCategories);
		expect(result).toEqual([]);
	});

	it("includes category id, name, and slug", () => {
		const result = extractCategoryOptions(sampleProducts);
		const tshirts = result.find((c) => c.slug === "t-shirts");

		expect(tshirts).toEqual({
			id: "cat-1",
			name: "T-Shirts",
			slug: "t-shirts",
			count: 2,
		});
	});
});

// =============================================================================
// extractColorOptions
// =============================================================================
describe("extractColorOptions", () => {
	it("extracts unique colors with counts", () => {
		const result = extractColorOptions(sampleProducts);

		// Black appears in 2 products (T-Shirt + Hoodie)
		// White appears in 2 products (T-Shirt + Hoodie)
		expect(result.find((c) => c.name === "Black")?.count).toBe(2);
		expect(result.find((c) => c.name === "White")?.count).toBe(2);
		expect(result.find((c) => c.name === "Blue")?.count).toBe(1);
		expect(result.find((c) => c.name === "Red")?.count).toBe(1);
	});

	it("includes hex color codes", () => {
		const result = extractColorOptions(sampleProducts);
		expect(result.find((c) => c.name === "Black")?.hex).toBe("#000000");
	});

	it("sorts by count descending", () => {
		const result = extractColorOptions(sampleProducts);

		// Black and White both have count 2, should be first
		expect(result[0].count).toBe(2);
		expect(result[1].count).toBe(2);
	});

	it("always includes selected colors even with count 0", () => {
		const result = extractColorOptions(sampleProducts, ["Purple", "Green"]);

		expect(result.find((c) => c.name === "Purple")).toEqual({ name: "Purple", count: 0 });
		expect(result.find((c) => c.name === "Green")).toEqual({ name: "Green", count: 0 });
	});

	it("preserves selected colors that exist in products", () => {
		const result = extractColorOptions(sampleProducts, ["Black"]);

		// Black should keep its count, not be reset to 0
		expect(result.find((c) => c.name === "Black")?.count).toBe(2);
	});
});

// =============================================================================
// extractSizeOptions
// =============================================================================
describe("extractSizeOptions", () => {
	it("extracts unique sizes with counts", () => {
		const result = extractSizeOptions(sampleProducts);

		// S appears in 3 products
		expect(result.find((s) => s.name === "S")?.count).toBe(3);
		// M appears in 3 products
		expect(result.find((s) => s.name === "M")?.count).toBe(3);
	});

	it("sorts standard sizes in logical order (XS, S, M, L, XL, XXL)", () => {
		const result = extractSizeOptions(productsWithStandardSizes);

		const names = result.map((s) => s.name);
		expect(names).toEqual(["XS", "S", "M", "L", "XL", "XXL"]);
	});

	it("always includes selected sizes even with count 0", () => {
		const result = extractSizeOptions(sampleProducts, ["XXXL"]);

		expect(result.find((s) => s.name === "XXXL")).toEqual({ name: "XXXL", count: 0 });
	});

	it("handles numeric sizes (jeans, shoes)", () => {
		const result = extractSizeOptions(sampleProducts);

		// Numeric sizes from jeans and sneakers
		expect(result.find((s) => s.name === "28")).toBeDefined();
		expect(result.find((s) => s.name === "10")).toBeDefined();
	});
});

// =============================================================================
// filterProducts
// =============================================================================
describe("filterProducts", () => {
	it("returns all products when no filters", () => {
		const result = filterProducts(sampleProducts, {});
		expect(result).toHaveLength(5);
	});

	it("filters by single color", () => {
		const result = filterProducts(sampleProducts, { colors: ["Black"] });

		// Black T-Shirt and Multi-Color Hoodie
		expect(result).toHaveLength(2);
		expect(result.every((p) => p.colors?.some((c) => c.name === "Black"))).toBe(true);
	});

	it("filters by multiple colors (OR logic)", () => {
		const result = filterProducts(sampleProducts, { colors: ["Red", "Blue"] });

		expect(result).toHaveLength(2);
	});

	it("filters by single size", () => {
		const result = filterProducts(sampleProducts, { sizes: ["XL"] });

		// White T-Shirt and Multi-Color Hoodie have XL
		expect(result).toHaveLength(2);
	});

	it("combines color and size filters (AND logic)", () => {
		const result = filterProducts(sampleProducts, {
			colors: ["Black"],
			sizes: ["S"],
		});

		// Only Black T-Shirt has both Black color and S size
		// Multi-Color Hoodie has Black but also has S
		expect(result).toHaveLength(2);
	});

	it("returns empty array when no products match", () => {
		const result = filterProducts(sampleProducts, { colors: ["Purple"] });
		expect(result).toEqual([]);
	});
});

// =============================================================================
// sortProductsClientSide
// =============================================================================
describe("sortProductsClientSide", () => {
	it("sorts by price ascending", () => {
		const result = sortProductsClientSide(sampleProducts, "price_asc");

		expect(result[0].price).toBe(29.99);
		expect(result[result.length - 1].price).toBe(149.99);
	});

	it("sorts by price descending", () => {
		const result = sortProductsClientSide(sampleProducts, "price_desc");

		expect(result[0].price).toBe(149.99);
		expect(result[result.length - 1].price).toBe(29.99);
	});

	it("sorts by newest (createdAt descending)", () => {
		const result = sortProductsClientSide(sampleProducts, "newest");

		expect(result[0].name).toBe("Multi-Color Hoodie"); // March 2024
		expect(result[result.length - 1].name).toBe("White T-Shirt"); // Jan 10 2024
	});

	it("returns original order for 'featured' sort", () => {
		const result = sortProductsClientSide(sampleProducts, "featured");

		expect(result[0].id).toBe(sampleProducts[0].id);
	});

	it("does not mutate original array", () => {
		const original = [...sampleProducts];
		sortProductsClientSide(sampleProducts, "price_asc");

		expect(sampleProducts).toEqual(original);
	});

	it("handles products without createdAt", () => {
		const products = [
			{ price: 10, createdAt: null },
			{ price: 20, createdAt: "2024-01-01T00:00:00Z" },
		];
		const result = sortProductsClientSide(products, "newest");

		// Product with date should come first
		expect(result[0].price).toBe(20);
	});
});

// =============================================================================
// buildActiveFilters
// =============================================================================
describe("buildActiveFilters", () => {
	it("returns empty array when no filters", () => {
		const result = buildActiveFilters({});
		expect(result).toEqual([]);
	});

	it("builds color filters", () => {
		const result = buildActiveFilters({ colors: ["Black", "White"] });

		expect(result).toEqual([
			{ key: "color", label: "Color", value: "Black" },
			{ key: "color", label: "Color", value: "White" },
		]);
	});

	it("builds size filters", () => {
		const result = buildActiveFilters({ sizes: ["S", "M"] });

		expect(result).toEqual([
			{ key: "size", label: "Size", value: "S" },
			{ key: "size", label: "Size", value: "M" },
		]);
	});

	it("builds price range filter with range", () => {
		const result = buildActiveFilters({ priceRange: "50-100" });

		expect(result).toEqual([{ key: "price", label: "Price", value: "$50 - $100" }]);
	});

	it("builds price range filter with open-ended max", () => {
		const result = buildActiveFilters({ priceRange: "200-" });

		expect(result).toEqual([{ key: "price", label: "Price", value: "$200+" }]);
	});

	it("combines all filter types", () => {
		const result = buildActiveFilters({
			colors: ["Black"],
			sizes: ["M"],
			priceRange: "50-100",
		});

		expect(result).toHaveLength(3);
		expect(result.map((f) => f.key)).toEqual(["color", "size", "price"]);
	});
});

// =============================================================================
// Static Price Ranges
// =============================================================================
describe("STATIC_PRICE_RANGES", () => {
	it("has 4 price ranges", () => {
		expect(STATIC_PRICE_RANGES).toHaveLength(4);
	});

	it("has correct format", () => {
		expect(STATIC_PRICE_RANGES[0]).toEqual({ label: "Under $50", value: "0-50" });
		expect(STATIC_PRICE_RANGES[3]).toEqual({ label: "$200+", value: "200-" });
	});

	it("STATIC_PRICE_RANGES_WITH_COUNT adds count: 0", () => {
		expect(STATIC_PRICE_RANGES_WITH_COUNT[0]).toEqual({
			label: "Under $50",
			value: "0-50",
			count: 0,
		});
	});
});
