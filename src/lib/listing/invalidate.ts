import {
	CACHE_PROFILES,
	buildCatchAllTag,
	buildTag,
	bustListingAllOnProductEvent,
	type CacheProfile,
	type PaperCacheLifeProfile,
	type WebhookEntity,
} from "@/lib/saleor";

export type ListingTag = { tag: string; profile: PaperCacheLifeProfile };

export type ListingInvalidationTarget = {
	slug?: string;
	categorySlug?: string;
	/**
	 * `undefined` — payload did not say, use the channel catch-all.
	 * `[]` — known to be in no collection.
	 */
	collectionSlugs?: string[];
};

function listingTag(profile: CacheProfile, channel: string, slug: string | undefined): ListingTag {
	return {
		tag: slug ? buildTag(profile, { slug, channel }) : buildCatchAllTag(profile, channel),
		profile: profile.cacheProfile,
	};
}

/**
 * Sharded listing tags for one product, category, or collection event.
 * Stock and metadata must not call this — see `listingTagsForDelivery`.
 */
export function planListingTags(
	entity: "product" | "category" | "collection",
	parsed: ListingInvalidationTarget,
	channel: string,
): ListingTag[] {
	switch (entity) {
		case "product": {
			const tags: ListingTag[] = [];
			if (bustListingAllOnProductEvent()) {
				tags.push({
					tag: buildTag(CACHE_PROFILES.listingAll, { channel }),
					profile: CACHE_PROFILES.listingAll.cacheProfile,
				});
			}
			tags.push(listingTag(CACHE_PROFILES.listingCategory, channel, parsed.categorySlug));
			if (parsed.collectionSlugs) {
				for (const collectionSlug of parsed.collectionSlugs) {
					tags.push(listingTag(CACHE_PROFILES.listingCollection, channel, collectionSlug));
				}
			} else {
				tags.push(listingTag(CACHE_PROFILES.listingCollection, channel, undefined));
			}
			return tags;
		}
		case "category":
			return [listingTag(CACHE_PROFILES.listingCategory, channel, parsed.slug)];
		case "collection":
			return [listingTag(CACHE_PROFILES.listingCollection, channel, parsed.slug)];
	}
}

/**
 * Tags to bust for one webhook delivery.
 * A missing scope (manual POST) still busts listings. `affectsListing: false`
 * (stock, metadata) busts none.
 */
export function listingTagsForDelivery(
	eventScope: { entity: WebhookEntity; affectsListing: boolean } | null,
	parsedType: string,
	parsed: ListingInvalidationTarget,
	channel: string,
): ListingTag[] {
	if (eventScope && !eventScope.affectsListing) return [];
	const entity = eventScope?.entity ?? parsedType;
	if (entity !== "product" && entity !== "category" && entity !== "collection") return [];
	return planListingTags(entity, parsed, channel);
}
