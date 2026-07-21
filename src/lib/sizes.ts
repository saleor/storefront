/**
 * Option / size ordering for product variants and PLP facets.
 *
 * - Known clothing size tokens (S, M, L, …) use semantic order.
 * - Everything else uses numeric-aware natural sort so "10" sorts after "2",
 *   "10mm" after "2mm", "Row 10" after "Row 2".
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

const NATURAL_COMPARE = { numeric: true, sensitivity: "base" } as const;

/**
 * Compare attribute option labels for display order.
 * Prefer semantic clothing sizes when both sides are known tokens; otherwise natural sort.
 */
export function compareOptionLabels(a: string, b: string): number {
	const aOrder = SIZE_ORDER[a.trim().toUpperCase()];
	const bOrder = SIZE_ORDER[b.trim().toUpperCase()];
	if (aOrder != null && bOrder != null) {
		return aOrder - bOrder;
	}
	return a.localeCompare(b, undefined, NATURAL_COMPARE);
}

/**
 * @deprecated Prefer {@link compareOptionLabels}. Kept as an alias for size-named call sites.
 */
export function compareSizes(a: string, b: string): number {
	return compareOptionLabels(a, b);
}

/**
 * Sort an array of size / option labels in logical order.
 */
export function sortSizes<T extends string>(sizes: T[]): T[] {
	return [...sizes].sort(compareOptionLabels);
}

/**
 * Sort objects with a display `name` (size chips, attribute options, PLP facets).
 */
export function sortByOptionLabel<T extends { name: string }>(items: T[]): T[] {
	return [...items].sort((a, b) => compareOptionLabels(a.name, b.name));
}

/** @deprecated Prefer {@link sortByOptionLabel}. */
export function sortBySizeProperty<T extends { name: string }>(items: T[]): T[] {
	return sortByOptionLabel(items);
}
