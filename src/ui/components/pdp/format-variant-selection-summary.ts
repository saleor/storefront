import { pickTranslatedName } from "@/lib/saleor-translations";
import type { PdpVariant } from "@/lib/catalog/get-product-data";
import { getAttributeValueDisplayName } from "@/ui/components/pdp/variant-selection/utils";

/**
 * Human-readable selection summary in merchant attribute order
 * (e.g. "Shoe size: 43 · Color: Pure blue"). Used by non-matrix buy boxes
 * when a deep-linked variant is resolved.
 */
export function formatVariantSelectionSummary(variant: PdpVariant): string {
	const parts: string[] = [];

	for (const attr of variant.selectionAttributes ?? []) {
		const attrName = pickTranslatedName({
			name: attr.attribute.name?.trim() || attr.attribute.slug || "",
			translation: attr.attribute.translation,
		});
		const valueName = attr.values[0] ? getAttributeValueDisplayName(attr.values[0]) : "";
		if (!attrName || !valueName) continue;
		parts.push(`${attrName}: ${valueName}`);
	}

	if (parts.length > 0) return parts.join(" · ");
	return variant.name?.trim() || "";
}
