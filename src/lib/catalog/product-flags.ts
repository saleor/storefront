/**
 * Product merchandising flags (Saleor product attributes).
 *
 * **Today — manual curation.** Merchandisers toggle the bestseller boolean on each
 * product in Saleor Dashboard (`bestseller` or `pulse-bestseller` on demo catalogs).
 * Paper reads it via the typed attribute API (`assignedAttribute(slug:)`) and renders
 * the badge on PLP cards and PDP. There is no auto-ranking or per-channel override yet —
 * every bestseller is an explicit choice.
 *
 * **Later — per-channel metadata.** When markets need different bestseller sets, extend
 * `resolveMerchandisingFlags()` with channel listing data or a channel-scoped model.
 * The storefront API stays the same; only the resolver gains channel-aware rules.
 */
export const PRODUCT_FLAG_SLUGS = {
	/** Canonical slug for new deployments. */
	bestseller: "bestseller",
	/** Pulse demo / legacy Saleor catalog slug. */
	pulseBestseller: "pulse-bestseller",
} as const;

/**
 * Slugs that mark a product as bestseller. Kept in sync (by hand) with the
 * `assignedAttribute(slug: …)` aliases in ProductListItem/ProductDetails graphql.
 * Still used on PDP to hide the bestseller attribute from the spec accordion.
 */
export const BESTSELLER_ATTRIBUTE_SLUGS = [
	PRODUCT_FLAG_SLUGS.bestseller,
	PRODUCT_FLAG_SLUGS.pulseBestseller,
] as const;

/**
 * One boolean attribute fetched via
 * `assignedAttribute(slug:) { ... on AssignedBooleanAttribute { value } }`.
 * The generated field is a union over every attribute type; only the boolean
 * member carries `value`, so the optional shape accepts the whole union.
 */
export type BooleanAttributeValue = { __typename?: string; value?: boolean | null } | null | undefined;

/** Bestseller flag fields as selected on the product (PLP fragment + PDP query). */
export type ProductBestsellerFlags = {
	bestseller?: BooleanAttributeValue;
	pulseBestseller?: BooleanAttributeValue;
};

/** True when a bestseller boolean attribute is set on the product. */
export function isBestseller(product: ProductBestsellerFlags | null | undefined): boolean {
	if (!product) return false;
	return product.bestseller?.value === true || product.pulseBestseller?.value === true;
}

/**
 * Merchandising flags for a product in a channel.
 * Today: reads the manual bestseller attribute only.
 * Future: layer per-channel rules here without changing PLP/PDP components.
 */
export function resolveMerchandisingFlags(
	product: ProductBestsellerFlags | null | undefined,
	_channel?: string,
) {
	return {
		isBestseller: isBestseller(product),
	};
}
