import { STOREFRONT_PAGE_TYPES } from "@/lib/content/constants";
import { STOREFRONT_POLICY_ATTRIBUTES as A } from "@/lib/content/attribute-slugs";
import type { StorefrontContentPageFragment } from "@/gql/graphql";
import type { PartialStorefrontContent } from "@/lib/content/saleor/types";
import { attrNumber, buildAttributeMap } from "@/lib/content/saleor/attributes";

/**
 * Channel-wide commerce policies (free-shipping threshold, returns window).
 *
 * Numbers come from `NUMERIC` attributes; an unset threshold leaves the code default.
 * Set the threshold to `0` in Dashboard to advertise free shipping on every order, and
 * model "no free-shipping program" by omitting the value (keeps the default) — UI hides
 * the progress bar / trust signal when the resolved threshold is `null`.
 */
export function mapPolicyPage(page: StorefrontContentPageFragment | null): PartialStorefrontContent {
	if (!page || page.pageType.slug !== STOREFRONT_PAGE_TYPES.policy) return {};

	const attrs = buildAttributeMap(page);

	const shipping: { freeShippingThreshold?: number } = {};
	const freeShippingThreshold = attrNumber(attrs, A.freeShippingThreshold);
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
