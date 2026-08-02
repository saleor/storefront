/**
 * PLP attribute facet configuration.
 *
 * Colors/sizes are presets of this table — not hardcoded special cases in the
 * GraphQL layer. Forks override this file to change which attribute slugs are
 * facets, URL param names, or alias lists.
 *
 * Listing queries use `buildProductListingConstraints` in filter-utils: when
 * facets are selected, Saleor `ProductWhereInput` ORs every slug in
 * `attributeSlug` + `attributeAliases` (e.g. `size` | `shoe-size`). URL tokens
 * are value slugs (normalized), not display names.
 *
 * @see skills/saleor-paper-storefront/rules/product-filtering.md
 */

export type PlpFacetControl = "swatch" | "chip";

export type PlpFacetConfig = {
	/** URL search-param key (e.g. `colors`, `sizes`). */
	param: string;
	/**
	 * Primary Saleor attribute slug (first OR branch in listing `where`).
	 * Always include real catalog slugs in `attributeAliases` too — e.g. sneakers
	 * often use `shoe-size` while apparel uses `size`.
	 */
	attributeSlug: string;
	/**
	 * Additional attribute slugs OR'd with `attributeSlug` in listing filters,
	 * and recognized when extracting options from card samples.
	 */
	attributeAliases: readonly string[];
	control: PlpFacetControl;
};

export const PLP_FACETS: readonly PlpFacetConfig[] = [
	{
		param: "colors",
		attributeSlug: "color",
		attributeAliases: ["colour"],
		control: "swatch",
	},
	{
		param: "sizes",
		attributeSlug: "size",
		attributeAliases: ["shoe-size", "clothing-size"],
		control: "chip",
	},
] as const;

export function getPlpFacetByParam(param: string): PlpFacetConfig | undefined {
	return PLP_FACETS.find((facet) => facet.param === param);
}

/** Normalize URL / attribute tokens to Saleor-style value slugs. */
export function normalizeFacetValueSlug(token: string): string {
	return token.trim().toLowerCase().replace(/\s+/g, "-");
}

/** Parse a comma-separated facet param into unique normalized slugs. */
export function parseFacetParam(raw: string | null | undefined): string[] {
	if (!raw) return [];
	const seen = new Set<string>();
	const out: string[] = [];
	for (const part of raw.split(",")) {
		const slug = normalizeFacetValueSlug(part);
		if (!slug || seen.has(slug)) continue;
		seen.add(slug);
		out.push(slug);
	}
	return out;
}

/** True when `slug` is configured as a color-like PLP facet attribute. */
export function isPlpColorFacetSlug(slug: string): boolean {
	const normalized = slug.toLowerCase();
	const color = PLP_FACETS.find((f) => f.param === "colors");
	if (!color) return false;
	return (
		normalized === color.attributeSlug ||
		color.attributeAliases.some((alias) => alias.toLowerCase() === normalized)
	);
}

/** True when `slug` is configured as a size-like PLP facet attribute. */
export function isPlpSizeFacetSlug(slug: string): boolean {
	const normalized = slug.toLowerCase();
	const size = PLP_FACETS.find((f) => f.param === "sizes");
	if (!size) return false;
	return (
		normalized === size.attributeSlug ||
		size.attributeAliases.some((alias) => alias.toLowerCase() === normalized)
	);
}
