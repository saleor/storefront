import type { MetadataRoute } from "next";

/**
 * Crawl policy is cost policy.
 *
 * Faceted/paginated listing URLs (`?price=`, `?colors=`, `?sizes=`, `?categories=`,
 * `?cursor=`…) are long-tail views. Listing *pages* stay params-only (cached first
 * page); the client swaps via `GET /api/listing`. Crawlers that ignore this file
 * still receive the canonical first-page HTML. Blocking the query permutations
 * loses no indexable content. Sorted views are cacheable on the API but duplicates
 * of the canonical document.
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
					"/*?*query=",
					// Per-user and transactional surfaces — dynamic on every hit, never indexable.
					"/checkout",
					"/order",
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
