import type { ProductCardData } from "../product-card-data";

/**
 * Test fixtures for filter-utils tests.
 */

function sizes(...names: string[]): { name: string; slug: string }[] {
	return names.map((name) => ({ name, slug: name.toLowerCase() }));
}

function color(name: string, hex: string): { name: string; slug: string; hex: string } {
	return { name, slug: name.toLowerCase(), hex };
}

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
		colors: [color("Black", "#000000")],
		sizes: sizes("S", "M", "L"),
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
		colors: [color("White", "#FFFFFF")],
		sizes: sizes("S", "M", "L", "XL"),
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
		colors: [color("Blue", "#0000FF")],
		sizes: sizes("28", "30", "32", "34"),
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
		colors: [color("Red", "#FF0000")],
		sizes: sizes("8", "9", "10", "11"),
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
		colors: [color("Black", "#000000"), color("White", "#FFFFFF")],
		sizes: sizes("S", "M", "L", "XL", "XXL"),
		createdAt: "2024-03-01T10:00:00Z",
	},
];

// Products without categories (edge case)
export const productsWithoutCategories: ProductCardData[] = [
	{
		id: "prod-x",
		name: "Uncategorized",
		slug: "uncategorized",
		price: 10,
		currency: "USD",
		image: "/img/x.jpg",
		href: "/products/uncategorized",
		colors: [color("Black", "#000000")],
		sizes: sizes("M"),
	},
];

export const productsWithStandardSizes: ProductCardData[] = [
	{
		id: "prod-size",
		name: "Sized Tee",
		slug: "sized-tee",
		price: 20,
		currency: "USD",
		image: "/img/s.jpg",
		href: "/products/sized-tee",
		sizes: sizes("XXL", "S", "M", "XL", "XS", "L"),
	},
];
