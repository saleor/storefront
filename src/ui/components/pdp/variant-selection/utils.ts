/**
 * Utility functions for transforming Saleor variant data.
 *
 * These pure functions handle data transformation separately from presentation,
 * making it easy to customize how Saleor data is interpreted.
 */

import type { VariantOption, AttributeGroup } from "./types";
import { getColorHex, isColorAttribute, isSizeAttribute, COLOR_NAME_TO_HEX } from "@/lib/colors";

// Re-export for backwards compatibility
export { COLOR_NAME_TO_HEX };

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
	pricing?: {
		price?: { gross: { amount: number; currency: string } } | null;
		priceUndiscounted?: { gross: { amount: number; currency: string } } | null;
	} | null;
};

// ============================================================================
// Discount Helpers
// ============================================================================

/**
 * Check if a variant has a discount.
 * Uses typeof to handle $0 prices correctly (0 is falsy in JS).
 */
function variantHasDiscount(variant: SaleorVariant): boolean {
	const price = variant.pricing?.price?.gross?.amount;
	const undiscounted = variant.pricing?.priceUndiscounted?.gross?.amount;
	return typeof undiscounted === "number" && typeof price === "number" && undiscounted > price;
}

/**
 * Calculate discount percentage for a variant.
 */
function getVariantDiscountPercent(variant: SaleorVariant): number {
	const price = variant.pricing?.price?.gross?.amount;
	const undiscounted = variant.pricing?.priceUndiscounted?.gross?.amount;
	if (typeof undiscounted !== "number" || typeof price !== "number" || undiscounted <= price) return 0;
	return Math.round(((undiscounted - price) / undiscounted) * 100);
}

/**
 * Get max discount info across a list of variants.
 */
function getMaxDiscountInfo(variants: SaleorVariant[]): { hasDiscount: boolean; maxPercent: number } {
	let hasDiscount = false;
	let maxPercent = 0;

	for (const variant of variants) {
		if (variantHasDiscount(variant)) {
			hasDiscount = true;
			const percent = getVariantDiscountPercent(variant);
			if (percent > maxPercent) maxPercent = percent;
		}
	}

	return { hasDiscount, maxPercent };
}

// ============================================================================
// Main Functions
// ============================================================================

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
					attrData.values.set(valueName, {
						variantIds: new Set(),
						colorHex: isColorAttribute(slug) ? getColorHex(val) : undefined,
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
			// Get all variants with this value
			const variantsWithValue = [...valueData.variantIds]
				.map((id) => variants.find((v) => v.id === id)!)
				.filter(Boolean);

			// Check availability
			const available = variantsWithValue.some((v) => (v.quantityAvailable ?? 0) > 0);

			// Get discount info
			const { hasDiscount, maxPercent } = getMaxDiscountInfo(variantsWithValue);

			options.push({
				id: valueName.toLowerCase().replace(/\s+/g, "-"),
				name: valueName,
				available,
				hasDiscount,
				discountPercent: maxPercent > 0 ? maxPercent : undefined,
				colorHex: valueData.colorHex,
				variantIds: [...valueData.variantIds],
			});
		}

		groups.push({ slug, name: data.name, options });
	}

	// Sort: color attributes first, then size, then others
	groups.sort((a, b) => {
		const aIsColor = isColorAttribute(a.slug);
		const bIsColor = isColorAttribute(b.slug);
		const aIsSize = isSizeAttribute(a.slug);
		const bIsSize = isSizeAttribute(b.slug);

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
 */
export function findMatchingVariant(
	variants: SaleorVariant[],
	selections: Record<string, string>,
): string | undefined {
	const selectionEntries = Object.entries(selections).filter(([, value]) => value);
	if (selectionEntries.length === 0) return undefined;

	// Get all attribute groups to verify all are selected
	const attributeGroups = groupVariantsByAttributes(variants);
	const allAttributesSelected = attributeGroups.every(
		(group) => selections[group.slug] !== undefined && selections[group.slug] !== "",
	);

	if (!allAttributesSelected) return undefined;

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

		if (allMatch) return variant.id;
	}

	return undefined;
}

/**
 * Get current selections from a variant ID.
 * Reverse lookup: given a variant ID, extract its attribute values.
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
 * - `available: true` - In stock
 * - `available: false` - Out of stock globally
 * - `existsWithCurrentSelection: true` - Variant exists with this + current selections
 * - `existsWithCurrentSelection: false` - No variant exists (will clear other selections)
 */
export function getOptionsForAttribute(
	variants: SaleorVariant[],
	attributeGroups: AttributeGroup[],
	currentSelections: Record<string, string>,
	targetAttributeSlug: string,
): VariantOption[] {
	const targetGroup = attributeGroups.find((g) => g.slug === targetAttributeSlug);
	if (!targetGroup) return [];

	const otherSelections = Object.entries(currentSelections).filter(([slug]) => slug !== targetAttributeSlug);

	return targetGroup.options.map((option) => {
		// Find ALL variants that have this option value
		const variantsWithOption = variants.filter((variant) => {
			const attr = variant.attributes.find(
				(a) => (a.attribute.slug ?? "").toLowerCase() === targetAttributeSlug.toLowerCase(),
			);
			return attr?.values.some((v) => (v.name ?? "").toLowerCase().replace(/\s+/g, "-") === option.id);
		});

		// Check availability and discount
		const available = variantsWithOption.some((v) => (v.quantityAvailable ?? 0) > 0);
		const { hasDiscount, maxPercent } = getMaxDiscountInfo(variantsWithOption);

		// Check if a variant exists with this option AND all other current selections
		let existsWithCurrentSelection = true;
		if (otherSelections.length > 0) {
			existsWithCurrentSelection = variantsWithOption.some((variant) => {
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

		return {
			...option,
			available,
			hasDiscount,
			discountPercent: maxPercent > 0 ? maxPercent : undefined,
			existsWithCurrentSelection,
		};
	});
}

/**
 * Smart selection handler that adjusts other attributes when needed.
 * When user selects an option that doesn't exist with current selections,
 * we clear conflicting selections rather than blocking the user.
 */
export function getAdjustedSelections(
	variants: SaleorVariant[],
	currentSelections: Record<string, string>,
	attributeSlug: string,
	newValue: string,
): Record<string, string> {
	const newSelections = { ...currentSelections, [attributeSlug]: newValue };
	const matchingVariant = findMatchingVariant(variants, newSelections);

	if (matchingVariant) return newSelections;

	// No exact match - keep only the newly selected attribute
	return { [attributeSlug]: newValue };
}

// Backwards compatibility alias
export const getAvailableOptionsForAttribute = getOptionsForAttribute;

/**
 * Check if any attribute group has no available options given current selections.
 * Returns info about "dead end" situations.
 */
export function getUnavailableAttributeInfo(
	variants: SaleorVariant[],
	attributeGroups: AttributeGroup[],
	currentSelections: Record<string, string>,
): { slug: string; name: string; blockedBy: string } | null {
	const selectionEntries = Object.entries(currentSelections).filter(([, value]) => value);
	if (selectionEntries.length === 0) return null;

	for (const group of attributeGroups) {
		if (currentSelections[group.slug]) continue;

		const options = getOptionsForAttribute(variants, attributeGroups, currentSelections, group.slug);
		const hasAnyAvailable = options.some((opt) => opt.available && opt.existsWithCurrentSelection !== false);

		if (!hasAnyAvailable) {
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
