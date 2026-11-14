import { STOREFRONT_PAGE_TYPES } from "@/lib/content/constants";
import { STOREFRONT_POLICY_ATTRIBUTES as A } from "@/lib/content/attribute-slugs";
import type { StorefrontContentPageFragment } from "@/gql/graphql";
import type { PartialStorefrontContent } from "@/lib/content/saleor/types";
import { attrNumber, buildAttributeMap } from "@/lib/content/saleor/attributes";

/**
 * Slug of the attribute before it was renamed to say it is an override ("Free shipping
 * threshold"). Stores that created their Models earlier still have it, possibly with a
 * value: it keeps working as the override. The renamed attribute wins when both are set.
 */
const LEGACY_FREE_SHIPPING_THRESHOLD = "free-shipping-threshold";

/**
 * Channel-wide commerce policies (free-shipping threshold, returns window).
 *
 * Numbers come from `NUMERIC` attributes. The free-shipping threshold belongs on the
 * shipping method in Saleor, and an unset attribute leaves it there
 * (`withFreeShippingThreshold`). A value here is an override, which is why the attribute
 * is labelled "override (not recommended)": it changes what the storefront advertises,
 * not what checkout charges. Set it to `0` to advertise free shipping on every order. UI hides the progress bar / trust signal when the
 * resolved threshold is `null`.
 */
export function mapPolicyPage(page: StorefrontContentPageFragment | null): PartialStorefrontContent {
	if (!page || page.pageType.slug !== STOREFRONT_PAGE_TYPES.policy) return {};

	const attrs = buildAttributeMap(page);

	const shipping: { freeShippingThreshold?: number } = {};
	const freeShippingThreshold =
		attrNumber(attrs, A.freeShippingThreshold) ?? attrNumber(attrs, LEGACY_FREE_SHIPPING_THRESHOLD);
	if (freeShippingThreshold !== undefined) shipping.freeShippingThreshold = freeShippingThreshold;

	const returns: { windowDays?: number } = {};
	const windowDays = attrNumber(attrs, A.returnsWindowDays);
	if (windowDays !== undefined) returns.windowDays = windowDays;

	const policies: NonNullable<PartialStorefrontContent["policies"]> = {};
	if (Object.keys(shipping).length > 0) policies.shipping = shipping;
	if (Object.keys(returns).length > 0) policies.returns = returns;

	if (Object.keys(policies).length === 0) return {};
	return { policies };
}
