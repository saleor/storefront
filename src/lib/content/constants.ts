/** Saleor PageType slug prefix for merchandising copy (Dashboard: "Storefront — …" tabs). */
export const STOREFRONT_PAGE_TYPE_PREFIX = "storefront-" as const;

/** Saleor PageType slugs — align with Saleor Configurator / Dashboard setup. */
export const STOREFRONT_PAGE_TYPES = {
	chrome: "storefront-chrome",
	homepage: "storefront-homepage",
	products: "storefront-products",
	cart: "storefront-cart",
	checkout: "storefront-checkout",
} as const;

export type StorefrontPageTypeSlug = (typeof STOREFRONT_PAGE_TYPES)[keyof typeof STOREFRONT_PAGE_TYPES];

const STOREFRONT_PAGE_TYPE_SLUGS = new Set<string>(Object.values(STOREFRONT_PAGE_TYPES));

/**
 * Global singleton page slug for a PageType.
 * Saleor enforces globally unique page slugs — one slug per PageType, not shared `default`.
 */
export function storefrontContentPageSlug(pageTypeSlug: StorefrontPageTypeSlug): string {
	return pageTypeSlug;
}

/**
 * Channel-specific override slug: `{pageTypeSlug}-{channel}`.
 * Resolution order in Saleor provider: channel slug → global PageType slug.
 */
export function storefrontContentPageSlugForChannel(
	pageTypeSlug: StorefrontPageTypeSlug,
	channel: string,
): string {
	return `${pageTypeSlug}-${channel}`;
}

/** All candidate slugs to fetch for one PageType (channel override + global). */
export function storefrontContentPageSlugCandidates(
	pageTypeSlug: StorefrontPageTypeSlug,
	channel: string,
): [string, string] {
	return [
		storefrontContentPageSlugForChannel(pageTypeSlug, channel),
		storefrontContentPageSlug(pageTypeSlug),
	];
}

export function isStorefrontPageTypeSlug(slug: string): slug is StorefrontPageTypeSlug {
	return STOREFRONT_PAGE_TYPE_SLUGS.has(slug);
}

/** True when a page slug belongs to the storefront content layer (any PageType or channel override). */
export function isStorefrontContentPageSlug(slug: string): boolean {
	if (isStorefrontPageTypeSlug(slug)) return true;

	for (const pageTypeSlug of STOREFRONT_PAGE_TYPE_SLUGS) {
		if (slug.startsWith(`${pageTypeSlug}-`)) return true;
	}

	return false;
}

/**
 * Channels to revalidate when a storefront content page is updated.
 * Global PageType slug → all channels; `{type}-{channel}` → that channel only.
 */
export function resolveStorefrontContentChannelsForPageSlug(
	pageSlug: string,
	channels: readonly string[],
): readonly string[] {
	if (!isStorefrontContentPageSlug(pageSlug)) return [];

	if (isStorefrontPageTypeSlug(pageSlug)) return channels;

	for (const pageTypeSlug of STOREFRONT_PAGE_TYPE_SLUGS) {
		const prefix = `${pageTypeSlug}-`;
		if (!pageSlug.startsWith(prefix)) continue;

		const channel = pageSlug.slice(prefix.length);
		return channels.includes(channel) ? [channel] : [];
	}

	return [];
}

/** @deprecated Use isStorefrontContentPageSlug */
export const STOREFRONT_CONTENT_DEFAULT_SLUG = "default" as const;

/** @deprecated Use isStorefrontContentPageSlug */
export function isStorefrontContentSingletonSlug(slug: string): boolean {
	return isStorefrontContentPageSlug(slug);
}
