/**
 * Legacy utility functions - kept for backwards compatibility.
 * New code should use the functions in utils.ts
 */

import type { VariantOption } from "./types";

/** Common color name to hex mappings */
const COLOR_NAME_TO_HEX: Record<string, string> = {
	black: "#1a1a1a",
	white: "#fafafa",
	red: "#dc2626",
	blue: "#2563eb",
	green: "#16a34a",
	yellow: "#eab308",
	orange: "#ea580c",
	purple: "#9333ea",
	pink: "#ec4899",
	gray: "#6b7280",
	grey: "#6b7280",
	brown: "#78350f",
	navy: "#1e3a5a",
	beige: "#d4c4a8",
	cream: "#fffdd0",
};

/**
 * @deprecated Use groupVariantsByAttributes instead
 */
export function extractColorHex(
	variant: {
		attributes: Array<{
			attribute: { slug?: string | null };
			values: Array<{ name?: string | null; value?: string | null }>;
		}>;
	},
	colorSlugs: string[] = ["color", "colour"],
): string | undefined {
	const colorAttr = variant.attributes.find((a) =>
		colorSlugs.includes((a.attribute.slug ?? "").toLowerCase()),
	);

	if (!colorAttr?.values[0]) return undefined;

	const hexValue = colorAttr.values[0].value;
	const colorName = colorAttr.values[0].name?.toLowerCase();

	if (hexValue) {
		if (hexValue.startsWith("#")) {
			return hexValue;
		}
		if (/^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hexValue)) {
			return `#${hexValue}`;
		}
	}

	if (colorName && colorName in COLOR_NAME_TO_HEX) {
		return COLOR_NAME_TO_HEX[colorName];
	}

	return undefined;
}

/**
 * @deprecated Use groupVariantsByAttributes instead
 */
export function transformVariantsToOptions(
	variants: Array<{
		id: string;
		name: string;
		quantityAvailable?: number | null;
		attributes: Array<{
			attribute: { slug?: string | null; name?: string | null };
			values: Array<{ name?: string | null; value?: string | null }>;
		}>;
	}>,
): VariantOption[] {
	return variants.map((variant) => ({
		id: variant.id,
		name: variant.name,
		available: (variant.quantityAvailable ?? 0) > 0,
		colorHex: extractColorHex(variant),
	}));
}

/**
 * @deprecated Use groupVariantsByAttributes instead
 */
export function inferSelectorLabel(
	variants: Array<{
		attributes: Array<{
			attribute: { slug?: string | null; name?: string | null };
		}>;
	}>,
): string {
	const colorSlugs = ["color", "colour"];
	const sizeSlugs = ["size", "shoe-size", "clothing-size"];

	for (const variant of variants) {
		for (const attr of variant.attributes) {
			const slug = (attr.attribute.slug ?? "").toLowerCase();

			if (colorSlugs.includes(slug)) return "Color";
			if (sizeSlugs.includes(slug)) return "Size";
		}
	}

	const firstAttr = variants[0]?.attributes[0]?.attribute.name;
	if (firstAttr) return firstAttr;

	return "Variant";
}
