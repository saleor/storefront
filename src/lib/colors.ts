/**
 * Color utilities for the storefront.
 *
 * Saleor's "Swatch" attribute type stores color values in `value.value` as hex.
 * For regular dropdown attributes, we fall back to mapping common color names.
 *
 * This utility is used consistently across:
 * - PDP variant selectors (color swatches)
 * - PLP product cards (color dots)
 * - Cart drawer (selected color display)
 * - Filter bar (color filter options)
 */

/**
 * Common color name to hex mappings.
 * Used as fallback when Saleor attributes don't have hex values.
 */
export const COLOR_NAME_TO_HEX: Record<string, string> = {
	// Neutrals
	black: "#1a1a1a",
	white: "#fafafa",
	gray: "#6b7280",
	grey: "#6b7280",

	// Primary colors
	red: "#dc2626",
	blue: "#2563eb",
	green: "#16a34a",
	yellow: "#eab308",

	// Secondary colors
	orange: "#ea580c",
	purple: "#9333ea",
	pink: "#ec4899",

	// Browns & earth tones
	brown: "#78350f",
	beige: "#d4c4a8",
	cream: "#fffdd0",
	tan: "#d2b48c",

	// Blues
	navy: "#1e3a5a",
	"light-blue": "#38bdf8",
	teal: "#0d9488",
	cyan: "#06b6d4",

	// Greens
	"dark-green": "#166534",
	lime: "#84cc16",
	olive: "#6b7021",

	// Reds & pinks
	maroon: "#7f1d1d",
	coral: "#f97316",
	rose: "#f43f5e",

	// Purples
	violet: "#8b5cf6",
	indigo: "#4f46e5",
	lavender: "#c4b5fd",

	// Metallics
	gold: "#ca8a04",
	silver: "#9ca3af",
};

/**
 * Check if a string is a valid hex color.
 */
export function isValidHex(value: string): boolean {
	// With or without # prefix, 6 or 8 characters (with alpha)
	return /^#?[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value);
}

/**
 * Normalize a hex color to have # prefix.
 */
export function normalizeHex(value: string): string {
	if (value.startsWith("#")) return value;
	return `#${value}`;
}

/**
 * Get hex color from a Saleor attribute value.
 *
 * Priority:
 * 1. `value.value` if it's a valid hex (Swatch attributes)
 * 2. Color name lookup from `value.name`
 * 3. undefined if no match
 *
 * @param value - The attribute value from Saleor
 * @returns Hex color string (with #) or undefined
 */
export function getColorHex(value: { name?: string | null; value?: string | null }): string | undefined {
	// Try hex value first (from Swatch attributes)
	if (value.value && isValidHex(value.value)) {
		return normalizeHex(value.value);
	}

	// Fall back to color name lookup
	if (value.name) {
		const normalizedName = value.name.toLowerCase().replace(/\s+/g, "-");
		return COLOR_NAME_TO_HEX[normalizedName];
	}

	return undefined;
}

/**
 * Check if an attribute slug is a color attribute.
 */
export function isColorAttribute(slug: string): boolean {
	const normalizedSlug = slug.toLowerCase();
	return normalizedSlug === "color" || normalizedSlug === "colour";
}

/**
 * Check if an attribute slug is a size attribute.
 */
export function isSizeAttribute(slug: string): boolean {
	const normalizedSlug = slug.toLowerCase();
	return normalizedSlug === "size" || normalizedSlug === "shoe-size" || normalizedSlug === "clothing-size";
}
