/** Normalized storefront marketing copy — provider-agnostic contract (v1). */
export const STOREFRONT_CONTENT_VERSION = 1 as const;

/**
 * Channel-wide commerce policies — the single source of truth for facts that copy
 * only *describes* (free-shipping threshold, returns window). These are structured
 * values (not strings): channel-scoped, locale-independent, and consumed by logic
 * (cart progress math) as well as interpolated into copy via `{placeholder}` tokens.
 */
export type ShippingPolicy = {
	/**
	 * Order subtotal in the channel currency required to unlock free shipping.
	 * `null` means the channel runs no free-shipping program (hide the progress bar,
	 * the "free delivery over" trust signal, and the announcement threshold).
	 */
	freeShippingThreshold: number | null;
};

export type ReturnsPolicy = {
	/** Number of days a customer has to return an order. */
	windowDays: number;
};

export type StorefrontPolicies = {
	shipping: ShippingPolicy;
	returns: ReturnsPolicy;
};

export type AnnouncementBarContent = {
	id: string;
	message: string;
	href: string | null;
	linkLabel: string | null;
	dismissible: boolean;
};

export type HomepageHeroContent = {
	heading: string;
	subheading: string;
	primaryCtaLabel: string;
};

export type HomepageFeaturedCollectionContent = {
	heading: string;
	/** Saleor collection slug for the product grid (Dashboard: Featured collection reference). */
	collectionSlug: string;
	limit: number;
};

export type HomepageBrandStoryContent = {
	heading: string;
	paragraphs: readonly string[];
};

export type HomepageColumnContent = {
	title: string;
	text: string;
};

export type HomepageValuesContent = {
	heading: string;
	columns: readonly HomepageColumnContent[];
	columnsDesktop: 2 | 3;
};

export type HomepageEditorialContent = {
	heading: string;
	paragraphs: readonly string[];
	imagePosition: "left" | "right";
	ctaLabel: string;
};

export type HomepageContent = {
	hero: HomepageHeroContent;
	featuredCollection: HomepageFeaturedCollectionContent;
	brandStory: HomepageBrandStoryContent;
	values: HomepageValuesContent;
	editorial: HomepageEditorialContent;
};

export type CartEmptyContent = {
	title: string;
	body: string;
	ctaLabel: string;
};

export type CartTrustContent = {
	/** Prefix before a formatted money amount (e.g. "Free delivery over"). */
	freeShippingPrefix: string;
	returnsLabel: string;
};

export type CartDrawerContent = {
	title: string;
	/** e.g. `{count} items` */
	itemCount: string;
	/** e.g. `Add {amount} more for free shipping` — `{amount}` is pre-formatted money */
	addForFreeShipping: string;
	freeShippingQualified: string;
	subtotal: string;
	shipping: string;
	shippingFree: string;
	shippingCalculated: string;
	total: string;
	checkout: string;
	continueShopping: string;
	/** e.g. `Remove {product}` */
	removeItem: string;
	decreaseQuantity: string;
	increaseQuantity: string;
};

export type CartPageContent = {
	title: string;
	/** e.g. `Qty: {count}` */
	quantity: string;
	/** e.g. `Variant: {name}` */
	variant: string;
	yourTotal: string;
	shippingNote: string;
	checkout: string;
};

export type CartContent = {
	empty: CartEmptyContent;
	trust: CartTrustContent;
	drawer: CartDrawerContent;
	page: CartPageContent;
};

export type CheckoutEmptyCartContent = {
	title: string;
	body: string;
	startShoppingLabel: string;
	goBackLabel: string;
};

export type CheckoutEmptySessionContent = {
	title: string;
	message: string;
};

export type CheckoutTrustContent = {
	secureCheckout: string;
	stripeProcessor: string;
};

export type CheckoutContent = {
	emptyCart: CheckoutEmptyCartContent;
	emptySession: CheckoutEmptySessionContent;
	marketingOptInLabel: string;
	trust: CheckoutTrustContent;
};

export type StorefrontChromeContent = {
	announcementBar: AnnouncementBarContent;
	nav: NavChromeContent;
};

export type NavChromeContent = {
	/** Top-level “All products” link in the mega menu. */
	allProductsLabel: string;
	/** Footer link in mega menu panels — e.g. `View all {label}`. */
	viewAllLabel: string;
};

export type ProductsListingContent = {
	title: string;
	description: string;
	breadcrumbHome: string;
	breadcrumbProducts: string;
};

export type StorefrontSurfacesContent = {
	homepage: HomepageContent;
	products: ProductsListingContent;
	cart: CartContent;
	checkout: CheckoutContent;
};

export type StorefrontContent = {
	version: typeof STOREFRONT_CONTENT_VERSION;
	policies: StorefrontPolicies;
	chrome: StorefrontChromeContent;
	surfaces: StorefrontSurfacesContent;
};

export type ContentProviderId = "code" | "saleor" | "url";

export type StorefrontContentRequest = {
	channel: string;
	/** URL locale slug (`en`, `pl`) — passed to Saleor `languageCode` when provider is `saleor`. */
	locale?: string;
};
