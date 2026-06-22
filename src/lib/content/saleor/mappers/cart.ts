import { STOREFRONT_PAGE_TYPES } from "@/lib/content/constants";
import { STOREFRONT_CART_ATTRIBUTES as A } from "@/lib/content/attribute-slugs";
import type { StorefrontContentPageFragment } from "@/gql/graphql";
import type { PartialStorefrontContent } from "@/lib/content/saleor/types";
import { attrText, buildAttributeMap } from "@/lib/content/saleor/attributes";
import { omitEmpty } from "@/lib/content/saleor/omit-empty";

export function mapCartPage(page: StorefrontContentPageFragment | null): PartialStorefrontContent {
	if (!page || page.pageType.slug !== STOREFRONT_PAGE_TYPES.cart) return {};

	const attrs = buildAttributeMap(page);
	const partial: PartialStorefrontContent = { surfaces: { cart: {} } };
	const cart = partial.surfaces!.cart!;

	const empty = omitEmpty({
		title: attrText(attrs, A.emptyTitle),
		body: attrText(attrs, A.emptyBody),
		ctaLabel: attrText(attrs, A.emptyCtaLabel),
	});
	if (Object.keys(empty).length > 0) {
		cart.empty = empty;
	}

	const trust = omitEmpty({
		freeShippingPrefix: attrText(attrs, A.trustFreeShippingPrefix),
		returnsLabel: attrText(attrs, A.trustReturnsLabel),
	});
	if (Object.keys(trust).length > 0) {
		cart.trust = trust;
	}

	// Functional drawer/page chrome (totals, buttons, a11y labels) is code-owned (next-intl,
	// `messages/*.json`); only editorial drawer copy is merchant-editable here — see ADR 0002.
	const drawer = omitEmpty({
		title: attrText(attrs, A.drawerTitle),
		addForFreeShipping: attrText(attrs, A.drawerAddForFreeShipping),
		freeShippingQualified: attrText(attrs, A.drawerFreeShippingQualified),
	});
	if (Object.keys(drawer).length > 0) {
		cart.drawer = drawer;
	}

	if (Object.keys(cart).length === 0) return {};
	return partial;
}
