import { STOREFRONT_PAGE_TYPES } from "@/lib/content/constants";
import { STOREFRONT_PRODUCTS_ATTRIBUTES as A } from "@/lib/content/attribute-slugs";
import type { StorefrontContentPageFragment } from "@/gql/graphql";
import type { PartialStorefrontContent } from "@/lib/content/saleor/types";
import { attrText, buildAttributeMap } from "@/lib/content/saleor/attributes";
import { omitEmpty } from "@/lib/content/saleor/omit-empty";

export function mapProductsPage(page: StorefrontContentPageFragment | null): PartialStorefrontContent {
	if (!page || page.pageType.slug !== STOREFRONT_PAGE_TYPES.products) return {};

	const attrs = buildAttributeMap(page);
	const products = omitEmpty({
		title: attrText(attrs, A.title),
		description: attrText(attrs, A.description),
		breadcrumbHome: attrText(attrs, A.breadcrumbHome),
		breadcrumbProducts: attrText(attrs, A.breadcrumbProducts),
	});

	if (!products || Object.keys(products).length === 0) {
		return {};
	}

	return { surfaces: { products } };
}
