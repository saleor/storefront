import type { SaleorVariant } from "../utils";

/**
 * Test fixtures for variant selection tests.
 *
 * These fixtures represent common product configurations:
 * - Single attribute products
 * - Multi-attribute products (color + size)
 * - Products with stock issues
 * - Products with discounts
 */

// =============================================================================
// Simple T-Shirt: Color + Size (6 variants, all in stock)
// =============================================================================
export const tshirtVariants: SaleorVariant[] = [
	{
		id: "tshirt-black-s",
		name: "Black / S",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Black", value: "black" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "S", value: "s" }] },
		],
		pricing: {
			price: { gross: { amount: 29.99, currency: "USD" } },
			priceUndiscounted: { gross: { amount: 29.99, currency: "USD" } },
		},
	},
	{
		id: "tshirt-black-m",
		name: "Black / M",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Black", value: "black" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "M", value: "m" }] },
		],
		pricing: {
			price: { gross: { amount: 29.99, currency: "USD" } },
			priceUndiscounted: { gross: { amount: 29.99, currency: "USD" } },
		},
	},
	{
		id: "tshirt-black-l",
		name: "Black / L",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Black", value: "black" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "L", value: "l" }] },
		],
		pricing: {
			price: { gross: { amount: 29.99, currency: "USD" } },
			priceUndiscounted: { gross: { amount: 29.99, currency: "USD" } },
		},
	},
	{
		id: "tshirt-white-s",
		name: "White / S",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "White", value: "white" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "S", value: "s" }] },
		],
		pricing: {
			price: { gross: { amount: 29.99, currency: "USD" } },
			priceUndiscounted: { gross: { amount: 29.99, currency: "USD" } },
		},
	},
	{
		id: "tshirt-white-m",
		name: "White / M",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "White", value: "white" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "M", value: "m" }] },
		],
		pricing: {
			price: { gross: { amount: 29.99, currency: "USD" } },
			priceUndiscounted: { gross: { amount: 29.99, currency: "USD" } },
		},
	},
	{
		id: "tshirt-white-l",
		name: "White / L",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "White", value: "white" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "L", value: "l" }] },
		],
		pricing: {
			price: { gross: { amount: 29.99, currency: "USD" } },
			priceUndiscounted: { gross: { amount: 29.99, currency: "USD" } },
		},
	},
];

// =============================================================================
// Sparse Matrix: Not all color/size combinations exist
// Red only comes in S, Blue comes in S/M/L
// =============================================================================
export const sparseVariants: SaleorVariant[] = [
	{
		id: "sparse-red-s",
		name: "Red / S",
		quantityAvailable: 5,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Red", value: "red" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "S", value: "s" }] },
		],
	},
	{
		id: "sparse-blue-s",
		name: "Blue / S",
		quantityAvailable: 5,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Blue", value: "blue" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "S", value: "s" }] },
		],
	},
	{
		id: "sparse-blue-m",
		name: "Blue / M",
		quantityAvailable: 5,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Blue", value: "blue" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "M", value: "m" }] },
		],
	},
	{
		id: "sparse-blue-l",
		name: "Blue / L",
		quantityAvailable: 5,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Blue", value: "blue" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "L", value: "l" }] },
		],
	},
];

// =============================================================================
// Out of Stock: Some variants have 0 quantity
// =============================================================================
export const stockVariants: SaleorVariant[] = [
	{
		id: "stock-green-s",
		name: "Green / S",
		quantityAvailable: 0, // Out of stock
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Green", value: "green" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "S", value: "s" }] },
		],
	},
	{
		id: "stock-green-m",
		name: "Green / M",
		quantityAvailable: 3, // In stock
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Green", value: "green" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "M", value: "m" }] },
		],
	},
	{
		id: "stock-yellow-s",
		name: "Yellow / S",
		quantityAvailable: 0, // Out of stock
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Yellow", value: "yellow" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "S", value: "s" }] },
		],
	},
	{
		id: "stock-yellow-m",
		name: "Yellow / M",
		quantityAvailable: 0, // Out of stock
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Yellow", value: "yellow" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "M", value: "m" }] },
		],
	},
];

// =============================================================================
// Discounted: Some variants have sales
// =============================================================================
export const discountedVariants: SaleorVariant[] = [
	{
		id: "disc-purple-s",
		name: "Purple / S",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Purple", value: "purple" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "S", value: "s" }] },
		],
		pricing: {
			price: { gross: { amount: 19.99, currency: "USD" } }, // 20% off
			priceUndiscounted: { gross: { amount: 24.99, currency: "USD" } },
		},
	},
	{
		id: "disc-purple-m",
		name: "Purple / M",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Purple", value: "purple" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "M", value: "m" }] },
		],
		pricing: {
			price: { gross: { amount: 24.99, currency: "USD" } }, // No discount
			priceUndiscounted: { gross: { amount: 24.99, currency: "USD" } },
		},
	},
	{
		id: "disc-orange-s",
		name: "Orange / S",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Orange", value: "orange" }] },
			{ attribute: { slug: "size", name: "Size" }, values: [{ name: "S", value: "s" }] },
		],
		pricing: {
			price: { gross: { amount: 0, currency: "USD" } }, // FREE (100% off)
			priceUndiscounted: { gross: { amount: 24.99, currency: "USD" } },
		},
	},
];

// =============================================================================
// Single Attribute: Only color, no size
// =============================================================================
export const singleAttributeVariants: SaleorVariant[] = [
	{
		id: "single-navy",
		name: "Navy",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Navy", value: "navy" }] },
		],
	},
	{
		id: "single-gray",
		name: "Gray",
		quantityAvailable: 10,
		selectionAttributes: [
			{ attribute: { slug: "color", name: "Color" }, values: [{ name: "Gray", value: "gray" }] },
		],
	},
];

// =============================================================================
// Name-Only Variants: No structured attributes, only names
// This is the fallback case when Saleor variants aren't properly configured
// =============================================================================
export const nameOnlyVariants: SaleorVariant[] = [
	{
		id: "name-only-navy-s",
		name: "Navy blue S",
		quantityAvailable: 10,
		selectionAttributes: [], // No structured attributes
		pricing: {
			price: { gross: { amount: 30.0, currency: "EUR" } },
			priceUndiscounted: { gross: { amount: 30.0, currency: "EUR" } },
		},
	},
	{
		id: "name-only-navy-m",
		name: "Navy blue M",
		quantityAvailable: 5,
		selectionAttributes: [], // No structured attributes
		pricing: {
			price: { gross: { amount: 30.0, currency: "EUR" } },
			priceUndiscounted: { gross: { amount: 30.0, currency: "EUR" } },
		},
	},
	{
		id: "name-only-navy-l",
		name: "Navy blue L",
		quantityAvailable: 0, // Out of stock
		selectionAttributes: [],
		pricing: {
			price: { gross: { amount: 30.0, currency: "EUR" } },
			priceUndiscounted: { gross: { amount: 30.0, currency: "EUR" } },
		},
	},
];

// =============================================================================
// Name-Only with Different Prices: For testing price display
// =============================================================================
export const nameOnlyDifferentPrices: SaleorVariant[] = [
	{
		id: "gift-25",
		name: "$25 Gift Card",
		quantityAvailable: 999,
		selectionAttributes: [],
		pricing: {
			price: { gross: { amount: 25.0, currency: "USD" } },
			priceUndiscounted: { gross: { amount: 25.0, currency: "USD" } },
		},
	},
	{
		id: "gift-50",
		name: "$50 Gift Card",
		quantityAvailable: 999,
		selectionAttributes: [],
		pricing: {
			price: { gross: { amount: 50.0, currency: "USD" } },
			priceUndiscounted: { gross: { amount: 50.0, currency: "USD" } },
		},
	},
	{
		id: "gift-100",
		name: "$100 Gift Card",
		quantityAvailable: 999,
		selectionAttributes: [],
		pricing: {
			price: { gross: { amount: 100.0, currency: "USD" } },
			priceUndiscounted: { gross: { amount: 100.0, currency: "USD" } },
		},
	},
];
