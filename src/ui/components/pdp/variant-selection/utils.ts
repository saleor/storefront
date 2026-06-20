/**
 * Utility functions for transforming Saleor variant data.
 *
 * These pure functions handle data transformation separately from presentation,
 * making it easy to customize how Saleor data is interpreted.
 */

import type { VariantOption, AttributeGroup } from "./types";
import {
	getSwatchData,
	isColorAttribute,
	isSizeAttribute,
	isSwatchInputType,
	shouldRenderAsSwatch,
	COLOR_NAME_TO_HEX,
} from "@/lib/colors";
import { getMaxDiscountInfo as getMaxDiscountInfoBase } from "@/lib/pricing";
import { pickTranslatedName } from "@/lib/saleor-translations";
import { sortBySizeProperty } from "@/lib/sizes";

// Re-export for backwards compatibility
export { COLOR_NAME_TO_HEX };

/**
 * Raw variant type from Saleor GraphQL
 */
export type SaleorAttributeValue = {
	name?: string | null;
	slug?: string | null;
	value?: string | null;
	translation?: { name?: string | null } | null;
	file?: { url?: string | null } | null;
};

export type SaleorVariantAttribute = {
	attribute: {
		slug?: string | null;
		name?: string | null;
		inputType?: string | null;
		translation?: { name?: string | null } | null;
	};
	values: SaleorAttributeValue[];
};

export type SaleorVariant = {
	id: string;
	name: string;
	quantityAvailable?: number | null;
	selectionAttributes: SaleorVariantAttribute[];
	nonSelectionAttributes?: SaleorVariantAttribute[];
	pricing?: {
		price?: { gross: { amount: number; currency: string } } | null;
		priceUndiscounted?: { gross: { amount: number; currency: string } } | null;
	} | null;
};

// ============================================================================
// Discount Helpers (using shared pricing utilities)
// ============================================================================

/**
 * Get max discount info across a list of variants.
 */
function getMaxDiscountInfo(variants: SaleorVariant[]): { hasDiscount: boolean; maxPercent: number } {
	const result = getMaxDiscountInfoBase(variants, (v) => ({
		current: v.pricing?.price?.gross?.amount,
		undiscounted: v.pricing?.priceUndiscounted?.gross?.amount,
	}));
	return {
		hasDiscount: result.isOnSale,
		maxPercent: result.discountPercent ?? 0,
	};
}

// ============================================================================
// Selection helpers
// ============================================================================

/** Normalize attribute value names to URL-safe option IDs. */
export function normalizeAttributeValueId(name: string): string {
	return name.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Stable, readable selection id for URL params.
 *
 * Prefers Saleor's `slug` (e.g. "pure-blue") so URLs stay human-readable and
 * translation-independent. Note: we intentionally do NOT use `value`, because for
 * SWATCH/color attributes Saleor stores the hex code there (e.g. "#0000ff"), which
 * would produce ugly encoded params like `?color=%230000ff`.
 */
export function getAttributeValueSelectionId(value: SaleorAttributeValue): string {
	const slug = value.slug?.trim();
	if (slug) return slug.toLowerCase();
	const name = value.name?.trim();
	return name ? normalizeAttributeValueId(name) : "";
}

/** Localized label for an attribute value (e.g. black → czarny). */
export function getAttributeValueDisplayName(value: SaleorAttributeValue): string {
	const fallback = value.name?.trim() ?? "";
	if (!fallback) return "";
	return pickTranslatedName({ name: fallback, translation: value.translation });
}

function getAttributeDisplayName(attribute: SaleorVariantAttribute["attribute"]): string {
	const fallback = attribute.name?.trim() ?? attribute.slug ?? "";
	return pickTranslatedName({ name: fallback, translation: attribute.translation });
}

/** True when a variant matches every entry in partial or complete selections. */
export function variantMatchesSelections(
	variant: SaleorVariant,
	selections: Record<string, string>,
): boolean {
	for (const [attrSlug, selectedValue] of Object.entries(selections)) {
		if (!selectedValue) continue;

		const attr = variant.selectionAttributes.find(
			(a) => (a.attribute.slug ?? "").toLowerCase() === attrSlug.toLowerCase(),
		);
		if (!attr) return false;

		const hasMatchingValue = attr.values.some(
			(v) => getAttributeValueSelectionId(v) === normalizeAttributeValueId(selectedValue),
		);
		if (!hasMatchingValue) return false;
	}

	return true;
}

/** True when a variant matches selections for every attribute except the target group. */
export function variantMatchesOtherSelections(
	variant: SaleorVariant,
	otherSelections: Array<[string, string]>,
): boolean {
	return variantMatchesSelections(variant, Object.fromEntries(otherSelections));
}

/** True when at least one variant satisfies all current selections. */
export function hasCompatibleVariant(
	variants: SaleorVariant[],
	selections: Record<string, string>,
	attributeGroups?: AttributeGroup[],
): boolean {
	const groups = attributeGroups ?? groupVariantsByAttributes(variants);
	const effectiveSelections = { ...getImplicitSelections(groups), ...selections };
	const selectionEntries = Object.entries(effectiveSelections).filter(([, value]) => value);
	if (selectionEntries.length === 0) return true;

	return variants.some((variant) => variantMatchesSelections(variant, effectiveSelections));
}

/** Auto-selected values for attributes with only one option across all variants. */
export function getImplicitSelections(attributeGroups: AttributeGroup[]): Record<string, string> {
	const implicit: Record<string, string> = {};

	for (const group of attributeGroups) {
		if (group.options.length === 1) {
			const onlyOption = group.options[0];
			if (onlyOption) {
				implicit[group.slug] = onlyOption.id;
			}
		}
	}

	return implicit;
}

/** Attribute groups that need a visible selector (more than one option). */
export function getInteractiveAttributeGroups(attributeGroups: AttributeGroup[]): AttributeGroup[] {
	return attributeGroups.filter((group) => group.options.length > 1);
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
 *
 * Single-option attributes are kept in the returned groups for matching logic.
 * Hide them in the UI via `getInteractiveAttributeGroups()` and auto-apply with
 * `getImplicitSelections()` when resolving the variant.
 */
export function groupVariantsByAttributes(variants: SaleorVariant[]): AttributeGroup[] {
	// Map: attributeSlug -> { name, inputType, values: Map<valueName, swatch data> }
	const attributeMap = new Map<
		string,
		{
			name: string;
			inputType?: string | null;
			values: Map<
				string,
				{ variantIds: Set<string>; displayName: string; colorHex?: string; swatchImageUrl?: string }
			>;
		}
	>();

	// Process each variant
	for (const variant of variants) {
		for (const attr of variant.selectionAttributes) {
			const slug = attr.attribute.slug ?? "";
			const name = getAttributeDisplayName(attr.attribute);

			if (!attributeMap.has(slug)) {
				attributeMap.set(slug, {
					name,
					inputType: attr.attribute.inputType,
					values: new Map(),
				});
			}

			const attrData = attributeMap.get(slug)!;

			for (const val of attr.values) {
				const valueId = getAttributeValueSelectionId(val);
				const displayName = getAttributeValueDisplayName(val);
				if (!valueId || !displayName) continue;

				if (!attrData.values.has(valueId)) {
					const swatch = getSwatchData(val);
					const useSwatch = shouldRenderAsSwatch(attr.attribute.inputType, slug, swatch);

					attrData.values.set(valueId, {
						variantIds: new Set(),
						displayName,
						colorHex: useSwatch ? swatch.colorHex : undefined,
						swatchImageUrl: useSwatch ? swatch.imageUrl : undefined,
					});
				}

				attrData.values.get(valueId)!.variantIds.add(variant.id);
			}
		}
	}

	// Convert to AttributeGroup array
	const groups: AttributeGroup[] = [];

	for (const [slug, data] of attributeMap) {
		const options: VariantOption[] = [];

		for (const [valueId, valueData] of data.values) {
			// Get all variants with this value
			const variantsWithValue = [...valueData.variantIds]
				.map((id) => variants.find((v) => v.id === id)!)
				.filter(Boolean);

			// Check availability
			const available = variantsWithValue.some((v) => (v.quantityAvailable ?? 0) > 0);

			// Get discount info
			const { hasDiscount, maxPercent } = getMaxDiscountInfo(variantsWithValue);

			options.push({
				id: valueId,
				name: valueData.displayName,
				available,
				hasDiscount,
				discountPercent: maxPercent > 0 ? maxPercent : undefined,
				colorHex: valueData.colorHex,
				swatchImageUrl: valueData.swatchImageUrl,
				variantIds: [...valueData.variantIds],
			});
		}

		// Sort size options in logical order (S, M, L, XL, etc.)
		const sortedOptions = isSizeAttribute(slug) ? sortBySizeProperty(options) : options;

		groups.push({ slug, name: data.name, options: sortedOptions });
	}

	// Sort: swatch/color attributes first, then size, then others
	groups.sort((a, b) => {
		const aData = attributeMap.get(a.slug);
		const bData = attributeMap.get(b.slug);
		const aIsSwatch =
			isSwatchInputType(aData?.inputType) ||
			isColorAttribute(a.slug) ||
			a.options.some((o) => o.colorHex || o.swatchImageUrl);
		const bIsSwatch =
			isSwatchInputType(bData?.inputType) ||
			isColorAttribute(b.slug) ||
			b.options.some((o) => o.colorHex || o.swatchImageUrl);
		const aIsSize = isSizeAttribute(a.slug);
		const bIsSize = isSizeAttribute(b.slug);

		if (aIsSwatch && !bIsSwatch) return -1;
		if (!aIsSwatch && bIsSwatch) return 1;
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
	attributeGroups?: AttributeGroup[],
): string | undefined {
	const groups = attributeGroups ?? groupVariantsByAttributes(variants);
	const effectiveSelections = { ...getImplicitSelections(groups), ...selections };
	const selectionEntries = Object.entries(effectiveSelections).filter(([, value]) => value);
	if (selectionEntries.length === 0) return undefined;

	const allAttributesSelected = groups.every(
		(group) => effectiveSelections[group.slug] !== undefined && effectiveSelections[group.slug] !== "",
	);

	if (!allAttributesSelected) return undefined;

	for (const variant of variants) {
		if (variantMatchesSelections(variant, effectiveSelections)) {
			return variant.id;
		}
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
	for (const attr of variant.selectionAttributes) {
		const slug = attr.attribute.slug ?? "";
		const value = attr.values[0] ? getAttributeValueSelectionId(attr.values[0]) : "";
		if (slug && value) {
			selections[slug] = value;
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

	const otherSelections = Object.entries(currentSelections).filter(
		([slug, value]) => slug !== targetAttributeSlug && value,
	);

	return targetGroup.options.map((option) => {
		// Find ALL variants that have this option value
		const variantsWithOption = variants.filter((variant) => {
			const attr = variant.selectionAttributes.find(
				(a) => (a.attribute.slug ?? "").toLowerCase() === targetAttributeSlug.toLowerCase(),
			);
			return attr?.values.some((v) => getAttributeValueSelectionId(v) === option.id);
		});

		// Check availability and discount
		const available = variantsWithOption.some((v) => (v.quantityAvailable ?? 0) > 0);

		// Discount badges should reflect the current selection context, not every variant
		// that shares this option value (e.g. another size with a $0 price).
		const variantsForDiscount =
			otherSelections.length > 0
				? variantsWithOption.filter((variant) => variantMatchesOtherSelections(variant, otherSelections))
				: variantsWithOption;
		const { hasDiscount, maxPercent } = getMaxDiscountInfo(variantsForDiscount);

		// Check if a variant exists with this option AND all other current selections
		const existsWithCurrentSelection =
			otherSelections.length === 0 ||
			variantsWithOption.some((variant) => variantMatchesOtherSelections(variant, otherSelections));

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
	attributeGroups?: AttributeGroup[],
): Record<string, string> {
	const groups = attributeGroups ?? groupVariantsByAttributes(variants);
	const newSelections = { ...currentSelections, [attributeSlug]: newValue };

	if (findMatchingVariant(variants, newSelections, groups)) {
		return newSelections;
	}

	const effectiveSelections = { ...getImplicitSelections(groups), ...newSelections };
	const allAttributesSelected = groups.every(
		(group) => effectiveSelections[group.slug] !== undefined && effectiveSelections[group.slug] !== "",
	);

	// Partial selection: keep building unless the combo is impossible
	if (!allAttributesSelected) {
		if (hasCompatibleVariant(variants, newSelections, groups)) {
			return newSelections;
		}
	}

	// Complete but impossible combo — clear conflicting selections
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
		if (group.options.length <= 1 || currentSelections[group.slug]) continue;

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
