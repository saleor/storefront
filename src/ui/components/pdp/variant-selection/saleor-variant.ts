/**
 * Shared Saleor variant shapes + attribute value ID helpers for PDP selection.
 */

import { pickTranslatedName } from "@/lib/saleor-translations";

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
	if (slug) return normalizeAttributeValueId(slug);
	const name = value.name?.trim();
	return name ? normalizeAttributeValueId(name) : "";
}

/** Localized label for an attribute value (e.g. black → czarny). */
export function getAttributeValueDisplayName(value: SaleorAttributeValue): string {
	const fallback = value.name?.trim() ?? "";
	if (!fallback) return "";
	return pickTranslatedName({ name: fallback, translation: value.translation });
}

export function getAttributeDisplayName(attribute: SaleorVariantAttribute["attribute"]): string {
	const fallback = attribute.name?.trim() ?? attribute.slug ?? "";
	return pickTranslatedName({ name: fallback, translation: attribute.translation });
}
