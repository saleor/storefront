/**
 * Pure helpers for locale/channel switches on translated catalog URLs.
 * Primary Saleor slug is identity; translated slugs are locale-canonical SEO skins.
 */

export type CatalogSlugKind = "products" | "categories" | "collections" | "pages";

export type CatalogIdentity = {
	kind: CatalogSlugKind;
	/** Saleor primary slug — stable across locales (cache / webhook identity). */
	primarySlug: string;
	/**
	 * Optional map of locale → canonical URL slug for zero-hop language switches.
	 * When missing, falls back to primarySlug (server 308s to the locale canonical).
	 */
	localeSlugs?: Record<string, string>;
};

const CATALOG_DETAIL_SUFFIX = /^\/(products|categories|collections|pages)\/([^/]+)(\/.*)?$/;

/**
 * Rewrite a catalog detail suffix for a language switch.
 * Prefers the target locale's translated slug when {@link CatalogIdentity.localeSlugs} is set.
 */
export function rewriteCatalogSuffixForLocaleSwitch(
	suffix: string,
	identity: CatalogIdentity,
	targetLocale: string,
): string {
	const match = suffix.match(CATALOG_DETAIL_SUFFIX);
	if (!match) return suffix;

	const kind = match[1] as CatalogSlugKind;
	const rest = match[3] ?? "";
	if (kind !== identity.kind) return suffix;

	const slug = identity.localeSlugs?.[targetLocale] ?? identity.primarySlug;
	return `/${kind}/${encodeURIComponent(slug)}${rest}`;
}

/**
 * When catalog identity is not registered yet (footer ready, detail shell still streaming),
 * do not keep a foreign-language handle — that 404s on Saleor. Drop to a safe suffix:
 * products listing when on a PDP; otherwise browse home.
 */
export function safeLocaleSwitchSuffixWithoutIdentity(suffix: string): string {
	const match = suffix.match(CATALOG_DETAIL_SUFFIX);
	if (!match) return suffix;

	const kind = match[1] as CatalogSlugKind;
	// Only `/products` has an index route under (main)/.
	if (kind === "products") return "/products";
	return "";
}

/** @deprecated Prefer {@link rewriteCatalogSuffixForLocaleSwitch} */
export function rewriteCatalogSuffixWithPrimarySlug(suffix: string, identity: CatalogIdentity): string {
	return rewriteCatalogSuffixForLocaleSwitch(suffix, identity, "");
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
