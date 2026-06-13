/**
 * Client-safe content exports (types, checkout context, constants).
 *
 * Server Components: import `getStorefrontContent` from `@/lib/content/server`.
 */
export { defaultStorefrontContent } from "@/lib/content/defaults";
export {
	STOREFRONT_PAGE_TYPE_PREFIX,
	STOREFRONT_PAGE_TYPES,
	isStorefrontContentPageSlug,
	resolveStorefrontContentChannelsForPageSlug,
	storefrontContentPageSlug,
	storefrontContentPageSlugForChannel,
} from "@/lib/content/constants";
export { CheckoutContentProvider, useCheckoutContent } from "@/lib/content/checkout-content-context";
export {
	buildPolicyLabelValues,
	formatPolicyAwareLabel,
	type PolicyLabelValues,
} from "@/lib/content/policy-format";
export type {
	AnnouncementBarContent,
	CartContent,
	CheckoutContent,
	HomepageContent,
	ReturnsPolicy,
	ShippingPolicy,
	StorefrontChromeContent,
	StorefrontContent,
	StorefrontPolicies,
	StorefrontSurfacesContent,
} from "@/lib/content/types";
