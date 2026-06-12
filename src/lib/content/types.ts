/** Normalized storefront marketing copy — provider-agnostic contract (v1). */
export const STOREFRONT_CONTENT_VERSION = 1 as const;

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

export type CartContent = {
	empty: CartEmptyContent;
	trust: CartTrustContent;
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
};

export type StorefrontSurfacesContent = {
	homepage: HomepageContent;
	cart: CartContent;
	checkout: CheckoutContent;
};

export type StorefrontContent = {
	version: typeof STOREFRONT_CONTENT_VERSION;
	chrome: StorefrontChromeContent;
	surfaces: StorefrontSurfacesContent;
};

export type ContentProviderId = "code" | "saleor" | "url";

export type StorefrontContentRequest = {
	channel: string;
	/** BCP 47 locale — included for future i18n; defaults to localeConfig.default. */
	locale?: string;
};
