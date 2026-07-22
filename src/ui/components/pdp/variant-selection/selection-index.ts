/**
 * Once-built indexes for high-cardinality PDP variant selection.
 *
 * Replaces nested O(variants × options) scans with Map/Set lookups so each
 * click stays cheap as product matrices approach PDP_VARIANT_CAP (see
 * `src/config/variants.ts`).
 */

import type { AttributeGroup, VariantOption } from "./types";
import { getSwatchData, shouldRenderAsSwatch } from "@/lib/colors";
import { getMaxDiscountInfo as getMaxDiscountInfoBase } from "@/lib/pricing";
import { sortByOptionLabel } from "@/lib/sizes";
import {
	getAttributeDisplayName,
	getAttributeValueDisplayName,
	getAttributeValueSelectionId,
	normalizeAttributeValueId,
	type SaleorVariant,
} from "./saleor-variant";

export type VariantSelectionIndex = {
	variantById: Map<string, SaleorVariant>;
	groups: AttributeGroup[];
	/** Frozen group order used for selection fingerprints. */
	groupSlugs: readonly string[];
	/** Auto-selected values for single-option groups (computed once). */
	implicitSelections: Readonly<Record<string, string>>;
	/** attrSlug → valueId → variant ids that carry that value */
	variantsByAttrValue: Map<string, Map<string, Set<string>>>;
	/** Complete selection fingerprint → variant id */
	variantBySelectionKey: Map<string, string>;
	/** variant id → attrSlug → valueId (first value per attribute) */
	selectionsByVariantId: Map<string, Record<string, string>>;
};

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

/** Stable fingerprint for a complete selection map (group order fixed by `groupSlugs`). */
export function selectionFingerprint(
	selections: Record<string, string>,
	groupSlugs: readonly string[],
): string | null {
	const parts: string[] = [];
	for (const slug of groupSlugs) {
		const raw = selections[slug];
		if (!raw) return null;
		parts.push(`${slug}=${normalizeAttributeValueId(raw)}`);
	}
	return parts.join("|");
}

function intersectSets(a: Set<string>, b: Set<string>): Set<string> {
	const [small, large] = a.size <= b.size ? [a, b] : [b, a];
	const out = new Set<string>();
	for (const id of small) {
		if (large.has(id)) out.add(id);
	}
	return out;
}

/**
 * Build all selection indexes in one O(variants × attrs) pass.
 * Call once per product payload (e.g. `useMemo` in the picker).
 */
export function buildVariantSelectionIndex(variants: SaleorVariant[]): VariantSelectionIndex {
	const variantById = new Map<string, SaleorVariant>();
	const variantsByAttrValue = new Map<string, Map<string, Set<string>>>();
	const selectionsByVariantId = new Map<string, Record<string, string>>();
	const variantBySelectionKey = new Map<string, string>();

	const attributeMap = new Map<
		string,
		{
			name: string;
			values: Map<
				string,
				{ variantIds: Set<string>; displayName: string; colorHex?: string; swatchImageUrl?: string }
			>;
		}
	>();

	for (const variant of variants) {
		variantById.set(variant.id, variant);
		const variantSelections: Record<string, string> = {};

		for (const attr of variant.selectionAttributes) {
			const slug = attr.attribute.slug ?? "";
			if (!slug) continue;

			const name = getAttributeDisplayName(attr.attribute);
			if (!attributeMap.has(slug)) {
				attributeMap.set(slug, { name, values: new Map() });
			}
			const attrData = attributeMap.get(slug)!;

			if (!variantsByAttrValue.has(slug)) {
				variantsByAttrValue.set(slug, new Map());
			}
			const valueMap = variantsByAttrValue.get(slug)!;

			for (const val of attr.values) {
				const valueId = getAttributeValueSelectionId(val);
				const displayName = getAttributeValueDisplayName(val);
				if (!valueId || !displayName) continue;

				// Match prior getSelectionsFromVariant: first value wins for the
				// reverse lookup / fingerprint. All values still index into
				// variantsByAttrValue for compatibility filtering.
				if (variantSelections[slug] === undefined) {
					variantSelections[slug] = valueId;
				}

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

				if (!valueMap.has(valueId)) {
					valueMap.set(valueId, new Set());
				}
				valueMap.get(valueId)!.add(variant.id);
			}
		}

		selectionsByVariantId.set(variant.id, variantSelections);
	}

	const groups: AttributeGroup[] = [];
	for (const [slug, data] of attributeMap) {
		const options: VariantOption[] = [];
		for (const [valueId, valueData] of data.values) {
			const variantsWithValue: SaleorVariant[] = [];
			for (const id of valueData.variantIds) {
				const v = variantById.get(id);
				if (v) variantsWithValue.push(v);
			}
			const available = variantsWithValue.some((v) => (v.quantityAvailable ?? 0) > 0);
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
		groups.push({ slug, name: data.name, options: sortByOptionLabel(options) });
	}

	const groupSlugs = groups.map((g) => g.slug);
	const implicitSelections: Record<string, string> = {};
	for (const group of groups) {
		if (group.options.length === 1) {
			const only = group.options[0];
			if (only) implicitSelections[group.slug] = only.id;
		}
	}

	for (const [variantId, sels] of selectionsByVariantId) {
		const key = selectionFingerprint(sels, groupSlugs);
		if (key && !variantBySelectionKey.has(key)) {
			variantBySelectionKey.set(key, variantId);
		}
	}

	return {
		variantById,
		groups,
		groupSlugs,
		implicitSelections,
		variantsByAttrValue,
		variantBySelectionKey,
		selectionsByVariantId,
	};
}

export function getImplicitSelectionsFromIndex(index: VariantSelectionIndex): Record<string, string> {
	return { ...index.implicitSelections };
}

function resolveValueSet(
	index: VariantSelectionIndex,
	attrSlug: string,
	selectedValue: string,
): Set<string> | undefined {
	const byValue = index.variantsByAttrValue.get(attrSlug);
	if (!byValue) {
		// Case-insensitive attr slug fallback (legacy URL / mismatched casing)
		for (const [slug, map] of index.variantsByAttrValue) {
			if (slug.toLowerCase() === attrSlug.toLowerCase()) {
				return map.get(selectedValue) ?? map.get(normalizeAttributeValueId(selectedValue));
			}
		}
		return undefined;
	}
	return byValue.get(selectedValue) ?? byValue.get(normalizeAttributeValueId(selectedValue));
}

/**
 * Intersect variant-id sets for each non-empty selection.
 * Returns `null` when there are no constraints (all variants eligible).
 */
export function intersectVariantIdsForSelections(
	index: VariantSelectionIndex,
	selections: Record<string, string>,
): Set<string> | null {
	let result: Set<string> | null = null;

	for (const [attrSlug, selectedValue] of Object.entries(selections)) {
		if (!selectedValue) continue;
		const set = resolveValueSet(index, attrSlug, selectedValue);
		if (!set) return new Set();

		result = result === null ? new Set(set) : intersectSets(result, set);
		if (result.size === 0) return result;
	}

	return result;
}

export function findMatchingVariantFromIndex(
	index: VariantSelectionIndex,
	selections: Record<string, string>,
): string | undefined {
	if (index.groupSlugs.length === 0) return undefined;

	const effective = { ...index.implicitSelections, ...selections };
	const key = selectionFingerprint(effective, index.groupSlugs);
	if (!key) return undefined;

	return index.variantBySelectionKey.get(key);
}

export function hasCompatibleVariantFromIndex(
	index: VariantSelectionIndex,
	selections: Record<string, string>,
): boolean {
	const effective = { ...index.implicitSelections, ...selections };
	const constrained = intersectVariantIdsForSelections(index, effective);
	if (constrained === null) return true;
	return constrained.size > 0;
}

export function getOptionsForAttributeFromIndex(
	index: VariantSelectionIndex,
	currentSelections: Record<string, string>,
	targetAttributeSlug: string,
): VariantOption[] {
	const targetGroup = index.groups.find((g) => g.slug === targetAttributeSlug);
	if (!targetGroup) return [];

	const otherSelections: Record<string, string> = {};
	for (const [slug, value] of Object.entries(currentSelections)) {
		if (slug !== targetAttributeSlug && value) {
			otherSelections[slug] = value;
		}
	}
	const othersIntersect = intersectVariantIdsForSelections(index, otherSelections);

	return targetGroup.options.map((option) => {
		const optionIds = resolveValueSet(index, targetAttributeSlug, option.id) ?? new Set<string>();

		const variantsWithOption: SaleorVariant[] = [];
		for (const id of optionIds) {
			const v = index.variantById.get(id);
			if (v) variantsWithOption.push(v);
		}

		const available = variantsWithOption.some((v) => (v.quantityAvailable ?? 0) > 0);

		let variantsForDiscount = variantsWithOption;
		let existsWithCurrentSelection = true;
		if (othersIntersect !== null) {
			const compatible = intersectSets(optionIds, othersIntersect);
			existsWithCurrentSelection = compatible.size > 0;
			variantsForDiscount = [];
			for (const id of compatible) {
				const v = index.variantById.get(id);
				if (v) variantsForDiscount.push(v);
			}
		}

		const { hasDiscount, maxPercent } = getMaxDiscountInfo(variantsForDiscount);

		return {
			...option,
			available,
			hasDiscount,
			discountPercent: maxPercent > 0 ? maxPercent : undefined,
			existsWithCurrentSelection,
		};
	});
}

export function getAdjustedSelectionsFromIndex(
	index: VariantSelectionIndex,
	currentSelections: Record<string, string>,
	attributeSlug: string,
	newValue: string,
): Record<string, string> {
	const newSelections = { ...currentSelections, [attributeSlug]: newValue };

	if (findMatchingVariantFromIndex(index, newSelections)) {
		return newSelections;
	}

	const effective = { ...index.implicitSelections, ...newSelections };
	const allSelected = index.groupSlugs.every((slug) => Boolean(effective[slug]));

	if (!allSelected) {
		if (hasCompatibleVariantFromIndex(index, newSelections)) {
			return newSelections;
		}
	}

	return { [attributeSlug]: newValue };
}

export function getSelectionsFromVariantFromIndex(
	index: VariantSelectionIndex,
	variantId: string,
): Record<string, string> {
	return { ...(index.selectionsByVariantId.get(variantId) ?? {}) };
}

export function getUnavailableAttributeInfoFromIndex(
	index: VariantSelectionIndex,
	currentSelections: Record<string, string>,
): { slug: string; name: string; blockedBy: string } | null {
	const selectionEntries = Object.entries(currentSelections).filter(([, value]) => value);
	if (selectionEntries.length === 0) return null;

	for (const group of index.groups) {
		if (group.options.length <= 1 || currentSelections[group.slug]) continue;

		const options = getOptionsForAttributeFromIndex(index, currentSelections, group.slug);
		const hasAnyAvailable = options.some((opt) => opt.available && opt.existsWithCurrentSelection !== false);
		if (!hasAnyAvailable) {
			const blockingSelection = selectionEntries[selectionEntries.length - 1]!;
			const blockingGroup = index.groups.find((g) => g.slug === blockingSelection[0]);
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
