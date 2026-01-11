/**
 * Static Pages Configuration
 *
 * Configure which pages are pre-rendered at build time.
 * This improves performance for your most important pages.
 *
 * Options for each section:
 * - Provide explicit slugs for full control
 * - Set to null/empty to fetch dynamically from Saleor
 * - Use collection slugs to pre-render entire collections
 */

export const staticPagesConfig = {
	/**
	 * Product pages to pre-render at build time.
	 *
	 * Options:
	 * 1. Explicit slugs (recommended for key products):
	 *    slugs: ["hero-product", "bestseller-tee", "new-arrival"]
	 *
	 * 2. Fetch from Saleor collection:
	 *    collection: "featured"
	 *
	 * 3. Fetch top N products by default:
	 *    slugs: null, fetchCount: 20
	 */
	products: {
		/** Explicit product slugs to pre-render (highest priority) */
		slugs: null as string[] | null,

		/** Or: fetch products from this collection slug */
		collection: null as string | null,

		/** Fallback: how many products to fetch if no slugs/collection specified */
		fetchCount: 20,
	},

	/**
	 * Category pages to pre-render.
	 * Set to null to fetch all categories dynamically.
	 */
	categories: {
		slugs: null as string[] | null,
		fetchCount: 10,
	},

	/**
	 * Collection pages to pre-render.
	 * Set to null to fetch all collections dynamically.
	 */
	collections: {
		slugs: null as string[] | null,
		fetchCount: 10,
	},

	/**
	 * Channel slugs for multi-channel stores.
	 * If set, no SALEOR_APP_TOKEN is needed.
	 *
	 * Example: ["default-channel", "us-store", "eu-store"]
	 */
	channels: null as string[] | null,
};

/**
 * Helper to get product slugs for static generation
 */
export function getStaticProductSlugs(): string[] | null {
	return staticPagesConfig.products.slugs;
}

/**
 * Helper to get the collection to fetch products from
 */
export function getStaticProductCollection(): string | null {
	return staticPagesConfig.products.collection;
}

/**
 * Helper to get fallback fetch count
 */
export function getStaticProductFetchCount(): number {
	return staticPagesConfig.products.fetchCount;
}

/**
 * Helper to get channel slugs (avoids needing SALEOR_APP_TOKEN)
 */
export function getStaticChannels(): string[] | null {
	return staticPagesConfig.channels;
}
