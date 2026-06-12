import type { PartialStorefrontContent } from "@/lib/content/saleor/types";
import type { StorefrontContent } from "@/lib/content/types";

/** Keep base array when override is missing or empty (unset Saleor list fields). */
function coalesceArray<T>(override: readonly T[] | undefined, base: readonly T[]): readonly T[] {
	if (override === undefined || override.length === 0) {
		return base;
	}
	return override;
}

/** Deep-merge partial storefront content over defaults (Saleor / URL providers). */
export function mergeStorefrontContent(
	base: StorefrontContent,
	override: PartialStorefrontContent | null | undefined,
): StorefrontContent {
	if (!override) return base;

	return {
		version: base.version,
		chrome: {
			...base.chrome,
			...override.chrome,
			announcementBar: {
				...base.chrome.announcementBar,
				...override.chrome?.announcementBar,
			},
		},
		surfaces: {
			homepage: {
				...base.surfaces.homepage,
				...override.surfaces?.homepage,
				hero: { ...base.surfaces.homepage.hero, ...override.surfaces?.homepage?.hero },
				featuredCollection: {
					...base.surfaces.homepage.featuredCollection,
					...override.surfaces?.homepage?.featuredCollection,
				},
				brandStory: {
					...base.surfaces.homepage.brandStory,
					...override.surfaces?.homepage?.brandStory,
					paragraphs: coalesceArray(
						override.surfaces?.homepage?.brandStory?.paragraphs,
						base.surfaces.homepage.brandStory.paragraphs,
					),
				},
				values: {
					...base.surfaces.homepage.values,
					...override.surfaces?.homepage?.values,
					columns: coalesceArray(
						override.surfaces?.homepage?.values?.columns,
						base.surfaces.homepage.values.columns,
					),
				},
				editorial: {
					...base.surfaces.homepage.editorial,
					...override.surfaces?.homepage?.editorial,
					paragraphs: coalesceArray(
						override.surfaces?.homepage?.editorial?.paragraphs,
						base.surfaces.homepage.editorial.paragraphs,
					),
				},
			},
			cart: {
				...base.surfaces.cart,
				...override.surfaces?.cart,
				empty: { ...base.surfaces.cart.empty, ...override.surfaces?.cart?.empty },
				trust: { ...base.surfaces.cart.trust, ...override.surfaces?.cart?.trust },
			},
			checkout: {
				...base.surfaces.checkout,
				...override.surfaces?.checkout,
				emptyCart: {
					...base.surfaces.checkout.emptyCart,
					...override.surfaces?.checkout?.emptyCart,
				},
				emptySession: {
					...base.surfaces.checkout.emptySession,
					...override.surfaces?.checkout?.emptySession,
				},
				trust: {
					...base.surfaces.checkout.trust,
					...override.surfaces?.checkout?.trust,
				},
			},
		},
	};
}
