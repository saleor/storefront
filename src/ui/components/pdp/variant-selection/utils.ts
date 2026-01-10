/**
 * Utility functions for transforming Saleor variant data.
 *
 * These pure functions handle data transformation separately from presentation,
 * making it easy to customize how Saleor data is interpreted.
 */

import type { VariantOption, AttributeGroup } from "./types";

/**
 * Common color name to hex mappings.
 * Used as fallback when swatch attributes don't have hex values.
 */
export const COLOR_NAME_TO_HEX: Record<string, string> = {
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

/** Attribute slugs that should render as color swatches */
const COLOR_ATTRIBUTE_SLUGS = ["color", "colour"];

/** Attribute slugs that should render as size buttons */
const SIZE_ATTRIBUTE_SLUGS = ["size", "shoe-size", "clothing-size"];

/**
 * Raw variant type from Saleor GraphQL
 */
export type SaleorVariant = {
	id: string;
	name: string;
	quantityAvailable?: number | null;
	attributes: Array<{
		attribute: { slug?: string | null; name?: string | null };
		values: Array<{ name?: string | null; value?: string | null }>;
	}>;
};

/**
 * Get color hex value from an attribute value.
 */
function getColorHexFromValue(value: { name?: string | null; value?: string | null }): string | undefined {
	const hexValue = value.value;
	const colorName = value.name?.toLowerCase();

	// Try hex value first (from swatch attributes)
	if (hexValue) {
		if (hexValue.startsWith("#")) {
			return hexValue;
		}
		// Handle hex without # prefix
		if (/^[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(hexValue)) {
			return `#${hexValue}`;
		}
	}

	// Fall back to common color names
	if (colorName && colorName in COLOR_NAME_TO_HEX) {
		return COLOR_NAME_TO_HEX[colorName];
	}

	return undefined;
}

/**
 * Group variants by their attributes.
 *
 * For a product with Color (Black, White) and Size (S, M, L), this returns:
 * [
 *   { slug: "color", name: "Color", options: [{ id: "black", name: "Black", colorHex: "#1a1a1a", ... }, ...] },
 *   { slug: "size", name: "Size", options: [{ id: "s", name: "S", ... }, ...] }
 * ]
 *
 * Each option tracks which variants it appears in, allowing us to:
 * - Show availability based on other selections
 * - Find the matching variant when all attributes are selected
 */
export function groupVariantsByAttributes(variants: SaleorVariant[]): AttributeGroup[] {
	// Map: attributeSlug -> { name, values: Map<valueName, { variantIds, colorHex }> }
	const attributeMap = new Map<
		string,
		{
			name: string;
			values: Map<string, { variantIds: Set<string>; colorHex?: string }>;
		}
	>();

	// Process each variant
	for (const variant of variants) {
		for (const attr of variant.attributes) {
			const slug = attr.attribute.slug ?? "";
			const name = attr.attribute.name ?? slug;

			if (!attributeMap.has(slug)) {
				attributeMap.set(slug, { name, values: new Map() });
			}

			const attrData = attributeMap.get(slug)!;

			for (const val of attr.values) {
				const valueName = val.name ?? "";
				if (!valueName) continue;

				if (!attrData.values.has(valueName)) {
					const isColorAttr = COLOR_ATTRIBUTE_SLUGS.includes(slug.toLowerCase());
					attrData.values.set(valueName, {
						variantIds: new Set(),
						colorHex: isColorAttr ? getColorHexFromValue(val) : undefined,
					});
				}

				attrData.values.get(valueName)!.variantIds.add(variant.id);
			}
		}
	}

	// Convert to AttributeGroup array
	const groups: AttributeGroup[] = [];

	for (const [slug, data] of attributeMap) {
		const options: VariantOption[] = [];

		for (const [valueName, valueData] of data.values) {
			// Check if any variant with this value is available
			const available = [...valueData.variantIds].some((variantId) => {
				const variant = variants.find((v) => v.id === variantId);
				return variant && (variant.quantityAvailable ?? 0) > 0;
			});

			options.push({
				id: valueName.toLowerCase().replace(/\s+/g, "-"),
				name: valueName,
				available,
				colorHex: valueData.colorHex,
				variantIds: [...valueData.variantIds],
			});
		}

		groups.push({
			slug,
			name: data.name,
			options,
		});
	}

	// Sort: color attributes first, then size, then others
	groups.sort((a, b) => {
		const aIsColor = COLOR_ATTRIBUTE_SLUGS.includes(a.slug.toLowerCase());
		const bIsColor = COLOR_ATTRIBUTE_SLUGS.includes(b.slug.toLowerCase());
		const aIsSize = SIZE_ATTRIBUTE_SLUGS.includes(a.slug.toLowerCase());
		const bIsSize = SIZE_ATTRIBUTE_SLUGS.includes(b.slug.toLowerCase());

		if (aIsColor && !bIsColor) return -1;
		if (!aIsColor && bIsColor) return 1;
		if (aIsSize && !bIsSize) return -1;
		if (!aIsSize && bIsSize) return 1;
		return 0;
	});

	return groups;
}

/**
 * Find the variant that matches all selected attribute values.
 *
 * IMPORTANT: Only returns a match if ALL attribute groups have a selection.
 * Partial selections (e.g., only Color selected, Size not selected) return undefined.
 *
 * @param variants - All variants
 * @param selections - Map of attributeSlug -> selected option id
 * @returns The matching variant ID, or undefined if no exact match or incomplete selection
 */
export function findMatchingVariant(
	variants: SaleorVariant[],
	selections: Record<string, string>,
): string | undefined {
	const selectionEntries = Object.entries(selections).filter(([, value]) => value);

	if (selectionEntries.length === 0) return undefined;

	// Get all attribute groups to verify all are selected
	const attributeGroups = groupVariantsByAttributes(variants);

	// Check if ALL attribute groups have a selection
	const allAttributesSelected = attributeGroups.every(
		(group) => selections[group.slug] !== undefined && selections[group.slug] !== "",
	);

	if (!allAttributesSelected) {
		// Partial selection - don't return a variant yet
		return undefined;
	}

	for (const variant of variants) {
		let allMatch = true;

		for (const [attrSlug, selectedValue] of selectionEntries) {
			const attr = variant.attributes.find(
				(a) => (a.attribute.slug ?? "").toLowerCase() === attrSlug.toLowerCase(),
			);

			if (!attr) {
				allMatch = false;
				break;
			}

			const hasMatchingValue = attr.values.some(
				(v) => (v.name ?? "").toLowerCase().replace(/\s+/g, "-") === selectedValue.toLowerCase(),
			);

			if (!hasMatchingValue) {
				allMatch = false;
				break;
			}
		}

		if (allMatch) {
			return variant.id;
		}
	}

	return undefined;
}

/**
 * Get current selections from a variant ID.
 *
 * Reverse lookup: given a variant ID, extract its attribute values
 * so we can populate the selectors.
 */
export function getSelectionsFromVariant(
	variants: SaleorVariant[],
	variantId: string,
): Record<string, string> {
	const variant = variants.find((v) => v.id === variantId);
	if (!variant) return {};

	const selections: Record<string, string> = {};

	for (const attr of variant.attributes) {
		const slug = attr.attribute.slug ?? "";
		const value = attr.values[0]?.name ?? "";
		if (slug && value) {
			selections[slug] = value.toLowerCase().replace(/\s+/g, "-");
		}
	}

	return selections;
}

/**
 * Get options for an attribute with availability and compatibility info.
 *
 * Options are marked as:
 * - `available: true` - In stock (at least one variant with this option is in stock)
 * - `available: false` - Out of stock globally (no variant with this option has stock)
 * - `existsWithCurrentSelection: true` - A variant exists with this option AND current other selections
 * - `existsWithCurrentSelection: false` - No variant exists with this combination (will clear other selections if clicked)
 *
 * Visual treatment:
 * - available=false → Strikethrough, disabled (can't buy)
 * - existsWithCurrentSelection=false → Dimmed (clickable, but will change other selections)
 */
export function getOptionsForAttribute(
	variants: SaleorVariant[],
	attributeGroups: AttributeGroup[],
	currentSelections: Record<string, string>,
	targetAttributeSlug: string,
): VariantOption[] {
	const targetGroup = attributeGroups.find((g) => g.slug === targetAttributeSlug);
	if (!targetGroup) return [];

	// Get other selections (not the target attribute)
	const otherSelections = Object.entries(currentSelections).filter(([slug]) => slug !== targetAttributeSlug);

	return targetGroup.options.map((option) => {
		// Find ALL variants that have this option value
		const variantsWithOption = variants.filter((variant) => {
			const attr = variant.attributes.find(
				(a) => (a.attribute.slug ?? "").toLowerCase() === targetAttributeSlug.toLowerCase(),
			);
			return attr?.values.some((v) => (v.name ?? "").toLowerCase().replace(/\s+/g, "-") === option.id);
		});

		// Option is available if ANY variant with this value is in stock
		const available = variantsWithOption.some((variant) => (variant.quantityAvailable ?? 0) > 0);

		// Check if a variant exists with this option AND all other current selections
		let existsWithCurrentSelection = true;
		if (otherSelections.length > 0) {
			existsWithCurrentSelection = variantsWithOption.some((variant) => {
				// Check if this variant matches all other selections
				for (const [attrSlug, selectedValue] of otherSelections) {
					const attr = variant.attributes.find(
						(a) => (a.attribute.slug ?? "").toLowerCase() === attrSlug.toLowerCase(),
					);
					if (!attr) return false;

					const hasValue = attr.values.some(
						(v) => (v.name ?? "").toLowerCase().replace(/\s+/g, "-") === selectedValue,
					);
					if (!hasValue) return false;
				}
				return true;
			});
		}

		return { ...option, available, existsWithCurrentSelection };
	});
}

/**
 * Smart selection handler that adjusts other attributes when needed.
 *
 * When user selects an option that doesn't exist with current selections,
 * we clear conflicting selections rather than blocking the user.
 *
 * @returns New selections map after adjustment
 */
export function getAdjustedSelections(
	variants: SaleorVariant[],
	currentSelections: Record<string, string>,
	attributeSlug: string,
	newValue: string,
): Record<string, string> {
	// Start with the new selection
	const newSelections: Record<string, string> = {
		...currentSelections,
		[attributeSlug]: newValue,
	};

	// Check if a variant exists with all current selections
	const matchingVariant = findMatchingVariant(variants, newSelections);

	if (matchingVariant) {
		// Perfect - combination exists
		return newSelections;
	}

	// No exact match - need to clear some selections
	// Strategy: Keep only the newly selected attribute, clear others
	// This allows user to "start fresh" from the new selection
	return { [attributeSlug]: newValue };
}

// Keep old function name for backwards compatibility
export const getAvailableOptionsForAttribute = getOptionsForAttribute;

/**
 * Check if any attribute group has no available options given current selections.
 *
 * Returns info about "dead end" situations, e.g.:
 * - User selected "Red" but no sizes are available in Red
 * - Returns: { slug: "size", name: "Size", blockedBy: "Red" }
 */
export function getUnavailableAttributeInfo(
	variants: SaleorVariant[],
	attributeGroups: AttributeGroup[],
	currentSelections: Record<string, string>,
): { slug: string; name: string; blockedBy: string } | null {
	// Need at least one selection to check
	const selectionEntries = Object.entries(currentSelections).filter(([, value]) => value);
	if (selectionEntries.length === 0) return null;

	for (const group of attributeGroups) {
		// Skip groups that already have a selection
		if (currentSelections[group.slug]) continue;

		// Get options for this group considering current selections
		const options = getOptionsForAttribute(variants, attributeGroups, currentSelections, group.slug);

		// Check if ANY option in this group is available (in stock + exists with current selections)
		const hasAnyAvailable = options.some((opt) => opt.available && opt.existsWithCurrentSelection !== false);

		if (!hasAnyAvailable) {
			// Find which selection is blocking this group
			// (the most recent selection that made this group unavailable)
			const blockingSelection = selectionEntries[selectionEntries.length - 1];
			const blockingGroup = attributeGroups.find((g) => g.slug === blockingSelection[0]);
			const blockingOption = blockingGroup?.options.find((o) => o.id === blockingSelection[1]);

			return {
				slug: group.slug,
				name: group.name,
				blockedBy: blockingOption?.name || blockingSelection[1],
			};
		}
	}

	return null;
}
