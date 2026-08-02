import type { StorefrontContentPageFragment } from "@/gql/graphql";
import {
	STOREFRONT_PAGE_TYPES,
	storefrontContentPageSlugCandidates,
	type StorefrontPageTypeSlug,
} from "@/lib/content/constants";

export function indexStorefrontPagesBySlug(
	pages: readonly StorefrontContentPageFragment[],
): Map<string, StorefrontContentPageFragment> {
	const bySlug = new Map<string, StorefrontContentPageFragment>();

	for (const page of pages) {
		if (!page.isPublished) continue;
		bySlug.set(page.slug, page);
	}

	return bySlug;
}

/** Channel override wins over global PageType slug. */
export function resolveStorefrontPageForType(
	bySlug: Map<string, StorefrontContentPageFragment>,
	pageTypeSlug: StorefrontPageTypeSlug,
	channel: string,
): StorefrontContentPageFragment | null {
	const [channelSlug, globalSlug] = storefrontContentPageSlugCandidates(pageTypeSlug, channel);
	return bySlug.get(channelSlug) ?? bySlug.get(globalSlug) ?? null;
}

export function collectStorefrontContentPageSlugs(channel: string): string[] {
	const slugs = new Set<string>();

	for (const pageTypeSlug of Object.values(STOREFRONT_PAGE_TYPES)) {
		for (const slug of storefrontContentPageSlugCandidates(pageTypeSlug, channel)) {
			slugs.add(slug);
		}
	}

	return [...slugs];
}
