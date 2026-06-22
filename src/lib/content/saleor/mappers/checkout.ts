import { STOREFRONT_PAGE_TYPES } from "@/lib/content/constants";
import { STOREFRONT_CHECKOUT_ATTRIBUTES as A } from "@/lib/content/attribute-slugs";
import type { StorefrontContentPageFragment } from "@/gql/graphql";
import type { PartialStorefrontContent } from "@/lib/content/saleor/types";
import { attrText, buildAttributeMap } from "@/lib/content/saleor/attributes";
import { omitEmpty } from "@/lib/content/saleor/omit-empty";

export function mapCheckoutPage(page: StorefrontContentPageFragment | null): PartialStorefrontContent {
	if (!page || page.pageType.slug !== STOREFRONT_PAGE_TYPES.checkout) return {};

	const attrs = buildAttributeMap(page);
	const partial: PartialStorefrontContent = { surfaces: { checkout: {} } };
	const checkout = partial.surfaces!.checkout!;

	const emptyCart = omitEmpty({
		title: attrText(attrs, A.emptyCartTitle),
		body: attrText(attrs, A.emptyCartBody),
		startShoppingLabel: attrText(attrs, A.emptyCartStartLabel),
		goBackLabel: attrText(attrs, A.emptyCartGoBackLabel),
	});
	if (Object.keys(emptyCart).length > 0) {
		checkout.emptyCart = emptyCart;
	}

	const emptySession = omitEmpty({
		title: attrText(attrs, A.emptySessionTitle),
		message: attrText(attrs, A.emptySessionMessage),
	});
	if (Object.keys(emptySession).length > 0) {
		checkout.emptySession = emptySession;
	}

	const marketingOptInLabel = attrText(attrs, A.marketingOptInLabel);
	if (marketingOptInLabel) {
		checkout.marketingOptInLabel = marketingOptInLabel;
	}

	const trust = omitEmpty({
		secureCheckout: attrText(attrs, A.trustSecureCheckout),
		stripeProcessor: attrText(attrs, A.trustStripeProcessor),
	});
	if (Object.keys(trust).length > 0) {
		checkout.trust = trust;
	}

	if (Object.keys(checkout).length === 0) return {};
	return partial;
}
