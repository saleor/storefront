import "server-only";

import { LEGAL_PAGE_KEYS, legalPageSlugs, type LegalPageKey } from "@/config/legal";
import { catalogPathSuffix } from "@/lib/catalog/canonical-slug";
import { getPageData } from "@/lib/catalog/get-page-data";
import { buildStorefrontPath } from "@/lib/storefront-path";

export type LegalLink = {
	/** The page's title in the shopper's language. */
	title: string;
	/** Path after `/{locale}/{channel}`, e.g. `/pages/terms`. */
	path: string;
};

export type LegalLinks = Partial<Record<LegalPageKey, LegalLink>>;

/**
 * The legal pages that exist in Saleor (slugs in `src/config/legal.ts`), keyed by purpose.
 * A missing page is left out, so callers render a link only when it leads somewhere.
 *
 * Each page is its own cached read, tagged `page:{slug}`: creating, renaming or deleting
 * the page in Saleor busts it through the page webhooks.
 */
export async function getLegalLinks(localeSlug: string): Promise<LegalLinks> {
	const pages = await Promise.all(
		LEGAL_PAGE_KEYS.map(async (key) => [key, await getPageData(legalPageSlugs[key], localeSlug)] as const),
	);

	const links: LegalLinks = {};
	for (const [key, page] of pages) {
		if (page?.title) {
			links[key] = { title: page.title, path: catalogPathSuffix("pages", page) };
		}
	}
	return links;
}

/** Full storefront URLs of the legal pages that exist, keyed by purpose. */
export async function getLegalHrefs(
	localeSlug: string,
	channel: string,
): Promise<Partial<Record<LegalPageKey, string>>> {
	const links = await getLegalLinks(localeSlug);
	const hrefs: Partial<Record<LegalPageKey, string>> = {};
	for (const key of LEGAL_PAGE_KEYS) {
		const link = links[key];
		if (link) {
			hrefs[key] = buildStorefrontPath(localeSlug, channel, link.path);
		}
	}
	return hrefs;
}
