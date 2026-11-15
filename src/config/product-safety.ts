/**
 * Product safety
 *
 * Saleor attribute slugs that Paper shows in the product page's "Material & safety" block,
 * always visible under the buy box. Every offer of a consumer product in the EU shows the
 * manufacturer's name and postal and electronic address, an EU responsible person where the
 * manufacturer is outside the EU, and warnings and safety information (GPSR, Regulation (EU)
 * 2023/988 Art. 19). Textiles show their fibre composition before purchase (Regulation (EU)
 * 1007/2011 Art. 16).
 *
 * Values are plain-text or choice attributes with Saleor translations. A shop with other slugs
 * adds them here; the first slug a product has wins. Attributes listed here leave the
 * "Product Details" accordion, so nothing shows twice.
 */
export const productSafetyAttributeSlugs = {
	material: ["material"],
	safetyInformation: ["safety-information"],
	manufacturer: ["manufacturer"],
	euResponsiblePerson: ["eu-responsible-person"],
} as const satisfies Record<string, readonly string[]>;

export type ProductSafetyField = keyof typeof productSafetyAttributeSlugs;

/** Display order in the block. */
export const PRODUCT_SAFETY_FIELDS: readonly ProductSafetyField[] = [
	"material",
	"safetyInformation",
	"manufacturer",
	"euResponsiblePerson",
];
