/**
 * Pure helpers for locale/channel switches on translated catalog URLs.
 * Primary Saleor slug is identity; translated slugs are locale-canonical SEO skins.
 */

export type CatalogSlugKind = "products" | "categories" | "collections" | "pages";

export type CatalogIdentity = {
	kind: CatalogSlugKind;
	/** Saleor primary slug — stable across locales (cache / webhook identity). */
	primarySlug: string;
};

const CATALOG_DETAIL_SUFFIX = /^\/(products|categories|collections|pages)\/([^/]+)(\/.*)?$/;

/**
 * When switching language, rewrite a translated URL slug to the primary slug so the
 * target locale can resolve + 308 to its own canonical slug (never 404).
 */
export function rewriteCatalogSuffixWithPrimarySlug(suffix: string, identity: CatalogIdentity): string {
	const match = suffix.match(CATALOG_DETAIL_SUFFIX);
	if (!match) return suffix;

	const kind = match[1] as CatalogSlugKind;
	const rest = match[3] ?? "";
	if (kind !== identity.kind) return suffix;

	return `/${kind}/${encodeURIComponent(identity.primarySlug)}${rest}`;
}

export function appendSearchParams(
	path: string,
	searchParams: { toString(): string } | string | undefined,
): string {
	if (!searchParams) return path;
	const query = typeof searchParams === "string" ? searchParams : searchParams.toString();
	if (!query) return path;
	return `${path}?${query}`;
}
