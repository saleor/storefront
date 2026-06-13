import { StorefrontContentPagesDocument } from "@/gql/graphql";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { STOREFRONT_PAGE_TYPES } from "@/lib/content/constants";
import type { ContentProvider } from "@/lib/content/provider";
import type { StorefrontContent } from "@/lib/content/types";
import { mergeStorefrontContent } from "@/lib/content/merge";
import { executePublicGraphQL } from "@/lib/graphql";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { mapCartPage } from "@/lib/content/saleor/mappers/cart";
import { mapCheckoutPage } from "@/lib/content/saleor/mappers/checkout";
import { mapChromePage } from "@/lib/content/saleor/mappers/chrome";
import { mapHomepagePage } from "@/lib/content/saleor/mappers/homepage";
import { mapProductsPage } from "@/lib/content/saleor/mappers/products";
import {
	collectStorefrontContentPageSlugs,
	indexStorefrontPagesBySlug,
	resolveStorefrontPageForType,
} from "@/lib/content/saleor/resolve-page";

async function fetchStorefrontPages(channel: string, localeSlug: string) {
	const slugs = collectStorefrontContentPageSlugs(channel);
	const result = await executePublicGraphQL(StorefrontContentPagesDocument, {
		variables: { channel, slugs, ...graphqlLanguageCodeVariables(localeSlug) },
	});

	if (!result.ok) {
		const message = `[content/saleor] Failed to fetch storefront pages for ${channel}: ${result.error.message}`;
		if (process.env.NODE_ENV === "production") {
			console.error(message);
		} else {
			console.warn(message);
		}
		return [];
	}

	return result.data.pages?.edges?.map((edge) => edge.node) ?? [];
}

export const saleorContentProvider: ContentProvider = {
	id: "saleor",
	async load({ channel, locale }) {
		const pages = await fetchStorefrontPages(channel, locale ?? "en");
		const bySlug = indexStorefrontPagesBySlug(pages);

		const mapperPartials = [
			mapChromePage(resolveStorefrontPageForType(bySlug, STOREFRONT_PAGE_TYPES.chrome, channel)),
			mapHomepagePage(resolveStorefrontPageForType(bySlug, STOREFRONT_PAGE_TYPES.homepage, channel)),
			mapProductsPage(resolveStorefrontPageForType(bySlug, STOREFRONT_PAGE_TYPES.products, channel)),
			mapCartPage(resolveStorefrontPageForType(bySlug, STOREFRONT_PAGE_TYPES.cart, channel)),
			mapCheckoutPage(resolveStorefrontPageForType(bySlug, STOREFRONT_PAGE_TYPES.checkout, channel)),
		];

		return mapperPartials.reduce<StorefrontContent>(
			(content, partial) => mergeStorefrontContent(content, partial),
			defaultStorefrontContent,
		);
	},
};
