/**
 * Size ordering utilities for product variants.
 *
 * Standard clothing sizes in logical order.
 * Used by product filtering and variant selection.
 */

/**
 * Size order map - lower number = smaller size.
 * Extend this if your store uses additional sizes.
 */
export const SIZE_ORDER: Record<string, number> = {
	XXS: 1,
	XS: 2,
	S: 3,
	M: 4,
	L: 5,
	XL: 6,
	XXL: 7,
	XXXL: 8,
	"2XL": 7, // Alias for XXL
	"3XL": 8, // Alias for XXXL
	"4XL": 9,
	"5XL": 10,
};

/**
 * Get the sort order for a size.
 * Falls back to parsing as number, then alphabetical (100).
 */
export function getSizeOrder(size: string): number {
	return SIZE_ORDER[size.toUpperCase()] ?? (parseInt(size) || 100);
}

/**
 * Compare two sizes for sorting.
 * Use with Array.sort(): sizes.sort(compareSizes)
 */
export function compareSizes(a: string, b: string): number {
	return getSizeOrder(a) - getSizeOrder(b);
}

/**
 * Sort an array of sizes in logical order.
 */
export function sortSizes<T extends string>(sizes: T[]): T[] {
	return [...sizes].sort(compareSizes);
}

/**
 * Sort objects with a size property.
 */
export function sortBySizeProperty<T extends { name: string }>(items: T[]): T[] {
	return [...items].sort((a, b) => compareSizes(a.name, b.name));
}
