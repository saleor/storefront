import type { MetadataRoute } from "next";

/**
 * Crawl policy is cost policy.
 *
 * Faceted/paginated listing URLs (`?price=`, `?colors=`, `?sizes=`, `?categories=`,
 * `?cursor=`…) are deliberately *uncached* long-tail views (see
 * `isCacheableListingView`) — every crawler hit is a billed function invocation plus
 * a live Saleor query, and the permutation space is combinatorial. Canonical URLs
 * already point at the clean listing, so blocking the query permutations loses no
 * indexable content. Sorted views are cached but pure duplicates of the canonical.
 *
 * Transactional and per-user surfaces (cart, checkout, account, search results) are
 * always-dynamic renders with nothing to index.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					// Faceted / paginated / sorted listing permutations (uncached long tail).
					"/*?*price=",
					"/*?*colors=",
					"/*?*sizes=",
					"/*?*categories=",
					"/*?*cursor=",
					"/*?*direction=",
					"/*?*sort=",
					// Per-user and transactional surfaces — dynamic on every hit, never indexable.
					"/checkout",
					"/api/",
					"/*/cart$",
					"/*/account",
					"/*/orders",
					"/*/login",
					"/*/signup",
					"/*/search",
				],
			},
		],
	};
}
