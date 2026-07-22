/**
 * Utility functions for transforming Saleor variant data.
 *
 * Public API stays stable; heavy matching uses a once-built
 * {@link buildVariantSelectionIndex}. Prefer building the index once in the
 * picker (`useMemo`) and calling the `*FromIndex` helpers for hot paths.
 */

import type { VariantOption, AttributeGroup } from "./types";
import { COLOR_NAME_TO_HEX } from "@/lib/colors";
import {
	getAttributeValueDisplayName,
	getAttributeValueSelectionId,
	normalizeAttributeValueId,
	type SaleorAttributeValue,
	type SaleorVariant,
	type SaleorVariantAttribute,
} from "./saleor-variant";
import {
	buildVariantSelectionIndex,
	findMatchingVariantFromIndex,
	getAdjustedSelectionsFromIndex,
	getImplicitSelectionsFromIndex,
	getOptionsForAttributeFromIndex,
	getSelectionsFromVariantFromIndex,
	getUnavailableAttributeInfoFromIndex,
	hasCompatibleVariantFromIndex,
} from "./selection-index";
import type { VariantSelectionIndex } from "./selection-index";

// Re-export for backwards compatibility
export { COLOR_NAME_TO_HEX };
export type { SaleorAttributeValue, SaleorVariantAttribute, SaleorVariant };
export { getAttributeValueDisplayName, getAttributeValueSelectionId, normalizeAttributeValueId };
export {
	buildVariantSelectionIndex,
	findMatchingVariantFromIndex,
	getAdjustedSelectionsFromIndex,
	getOptionsForAttributeFromIndex,
	getSelectionsFromVariantFromIndex,
	getUnavailableAttributeInfoFromIndex,
	hasCompatibleVariantFromIndex,
	type VariantSelectionIndex,
};

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

		const hasMatchingValue = attr.values.some((v) => {
			const valueId = getAttributeValueSelectionId(v);
			return valueId === selectedValue || valueId === normalizeAttributeValueId(selectedValue);
		});
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
	_attributeGroups?: AttributeGroup[],
): boolean {
	return hasCompatibleVariantFromIndex(buildVariantSelectionIndex(variants), selections);
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

/**
 * Group variants by their attributes.
 *
 * Single-option attributes are kept in the returned groups for matching logic.
 * Hide them in the UI via `getInteractiveAttributeGroups()` and auto-apply with
 * `getImplicitSelections()` when resolving the variant.
 *
 * Preserves first-seen attribute order from variants — Saleor returns
 * selectionAttributes in product-type assignment order.
 */
export function groupVariantsByAttributes(variants: SaleorVariant[]): AttributeGroup[] {
	return buildVariantSelectionIndex(variants).groups;
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
	_attributeGroups?: AttributeGroup[],
): string | undefined {
	return findMatchingVariantFromIndex(buildVariantSelectionIndex(variants), selections);
}

/**
 * Get current selections from a variant ID.
 * Reverse lookup: given a variant ID, extract its attribute values.
 */
export function getSelectionsFromVariant(
	variants: SaleorVariant[],
	variantId: string,
): Record<string, string> {
	return getSelectionsFromVariantFromIndex(buildVariantSelectionIndex(variants), variantId);
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
	_attributeGroups: AttributeGroup[],
	currentSelections: Record<string, string>,
	targetAttributeSlug: string,
): VariantOption[] {
	return getOptionsForAttributeFromIndex(
		buildVariantSelectionIndex(variants),
		currentSelections,
		targetAttributeSlug,
	);
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
	_attributeGroups?: AttributeGroup[],
): Record<string, string> {
	return getAdjustedSelectionsFromIndex(
		buildVariantSelectionIndex(variants),
		currentSelections,
		attributeSlug,
		newValue,
	);
}

// Backwards compatibility alias
export const getAvailableOptionsForAttribute = getOptionsForAttribute;

/**
 * Check if any attribute group has no available options given current selections.
 * Returns info about "dead end" situations.
 */
export function getUnavailableAttributeInfo(
	variants: SaleorVariant[],
	_attributeGroups: AttributeGroup[],
	currentSelections: Record<string, string>,
): { slug: string; name: string; blockedBy: string } | null {
	return getUnavailableAttributeInfoFromIndex(buildVariantSelectionIndex(variants), currentSelections);
}

export { getImplicitSelectionsFromIndex };
