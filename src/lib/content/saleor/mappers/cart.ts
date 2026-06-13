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

	const drawer = omitEmpty({
		title: attrText(attrs, A.drawerTitle),
		itemCount: attrText(attrs, A.drawerItemCount),
		addForFreeShipping: attrText(attrs, A.drawerAddForFreeShipping),
		freeShippingQualified: attrText(attrs, A.drawerFreeShippingQualified),
		subtotal: attrText(attrs, A.drawerSubtotal),
		shipping: attrText(attrs, A.drawerShipping),
		shippingFree: attrText(attrs, A.drawerShippingFree),
		shippingCalculated: attrText(attrs, A.drawerShippingCalculated),
		total: attrText(attrs, A.drawerTotal),
		checkout: attrText(attrs, A.drawerCheckout),
		continueShopping: attrText(attrs, A.drawerContinueShopping),
		removeItem: attrText(attrs, A.drawerRemoveItem),
		decreaseQuantity: attrText(attrs, A.drawerDecreaseQuantity),
		increaseQuantity: attrText(attrs, A.drawerIncreaseQuantity),
	});
	if (Object.keys(drawer).length > 0) {
		cart.drawer = drawer;
	}

	const pageContent = omitEmpty({
		title: attrText(attrs, A.pageTitle),
		quantity: attrText(attrs, A.pageQuantity),
		variant: attrText(attrs, A.pageVariant),
		yourTotal: attrText(attrs, A.pageYourTotal),
		shippingNote: attrText(attrs, A.pageShippingNote),
		checkout: attrText(attrs, A.pageCheckout),
	});
	if (Object.keys(pageContent).length > 0) {
		cart.page = pageContent;
	}

	if (Object.keys(cart).length === 0) return {};
	return partial;
}
