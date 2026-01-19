import type { ProductCardData } from "../product-card";

/**
 * Test fixtures for filter-utils tests.
 */

export const sampleProducts: ProductCardData[] = [
	{
		id: "prod-1",
		name: "Black T-Shirt",
		slug: "black-tshirt",
		price: 29.99,
		currency: "USD",
		image: "/img/1.jpg",
		href: "/products/black-tshirt",
		category: { id: "cat-1", name: "T-Shirts", slug: "t-shirts" },
		colors: [{ name: "Black", hex: "#000000" }],
		sizes: ["S", "M", "L"],
		createdAt: "2024-01-15T10:00:00Z",
	},
	{
		id: "prod-2",
		name: "White T-Shirt",
		slug: "white-tshirt",
		price: 29.99,
		currency: "USD",
		image: "/img/2.jpg",
		href: "/products/white-tshirt",
		category: { id: "cat-1", name: "T-Shirts", slug: "t-shirts" },
		colors: [{ name: "White", hex: "#FFFFFF" }],
		sizes: ["S", "M", "L", "XL"],
		createdAt: "2024-01-10T10:00:00Z",
	},
	{
		id: "prod-3",
		name: "Blue Jeans",
		slug: "blue-jeans",
		price: 79.99,
		currency: "USD",
		image: "/img/3.jpg",
		href: "/products/blue-jeans",
		category: { id: "cat-2", name: "Jeans", slug: "jeans" },
		colors: [{ name: "Blue", hex: "#0000FF" }],
		sizes: ["28", "30", "32", "34"],
		createdAt: "2024-02-01T10:00:00Z",
	},
	{
		id: "prod-4",
		name: "Red Sneakers",
		slug: "red-sneakers",
		price: 149.99,
		currency: "USD",
		image: "/img/4.jpg",
		href: "/products/red-sneakers",
		category: { id: "cat-3", name: "Sneakers", slug: "sneakers" },
		colors: [{ name: "Red", hex: "#FF0000" }],
		sizes: ["8", "9", "10", "11"],
		createdAt: "2024-02-15T10:00:00Z",
	},
	{
		id: "prod-5",
		name: "Multi-Color Hoodie",
		slug: "multi-hoodie",
		price: 89.99,
		currency: "USD",
		image: "/img/5.jpg",
		href: "/products/multi-hoodie",
		category: { id: "cat-4", name: "Hoodies", slug: "hoodies" },
		colors: [
			{ name: "Black", hex: "#000000" },
			{ name: "White", hex: "#FFFFFF" },
		],
		sizes: ["S", "M", "L", "XL", "XXL"],
		createdAt: "2024-03-01T10:00:00Z",
	},
];

// Products without categories (edge case)
export const productsWithoutCategories: ProductCardData[] = [
	{
		id: "prod-no-cat",
		name: "Mystery Item",
		slug: "mystery",
		price: 19.99,
		currency: "USD",
		image: "/img/x.jpg",
		href: "/products/mystery",
		colors: [],
		sizes: [],
	},
];

// Products with standard sizes for sort testing
export const productsWithStandardSizes: ProductCardData[] = [
	{
		id: "size-1",
		name: "Size Test 1",
		slug: "size-1",
		price: 10,
		currency: "USD",
		image: "/img/s1.jpg",
		href: "/products/size-1",
		sizes: ["XL", "S", "XXL", "M", "L", "XS"],
	},
];
