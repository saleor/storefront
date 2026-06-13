/**
 * Attribute slug contract between Saleor PageTypes (Configurator / Dashboard) and Paper mappers.
 * Grouped by PageType — see config/saleor/storefront-content.config.yml.
 */
export const STOREFRONT_CHROME_ATTRIBUTES = {
	announcementId: "announcement-id",
	announcementMessage: "announcement-message",
	announcementHref: "announcement-href",
	announcementLinkLabel: "announcement-link-label",
	announcementDismissible: "announcement-dismissible",
	navAllProductsLabel: "nav-all-products-label",
	navViewAllLabel: "nav-view-all-label",
} as const;

export const STOREFRONT_PRODUCTS_ATTRIBUTES = {
	title: "listing-title",
	description: "listing-description",
	breadcrumbHome: "breadcrumb-home",
	breadcrumbProducts: "breadcrumb-products",
} as const;

export const STOREFRONT_HOMEPAGE_ATTRIBUTES = {
	heroHeading: "hero-heading",
	heroSubheading: "hero-subheading",
	heroCtaLabel: "hero-cta-label",
	featuredHeading: "featured-heading",
	featuredCollection: "featured-collection",
	featuredLimit: "featured-limit",
	brandStoryHeading: "brand-story-heading",
	brandStoryParagraph1: "brand-story-paragraph-1",
	brandStoryParagraph2: "brand-story-paragraph-2",
	valuesHeading: "values-heading",
	valuesColumnsDesktop: "values-columns-desktop",
	valuesColumn1Title: "values-column-1-title",
	valuesColumn1Text: "values-column-1-text",
	valuesColumn2Title: "values-column-2-title",
	valuesColumn2Text: "values-column-2-text",
	valuesColumn3Title: "values-column-3-title",
	valuesColumn3Text: "values-column-3-text",
	editorialHeading: "editorial-heading",
	editorialParagraph1: "editorial-paragraph-1",
	editorialImagePosition: "editorial-image-position",
	editorialCtaLabel: "editorial-cta-label",
} as const;

export const STOREFRONT_CART_ATTRIBUTES = {
	emptyTitle: "empty-title",
	emptyBody: "empty-body",
	emptyCtaLabel: "empty-cta-label",
	trustFreeShippingPrefix: "trust-free-shipping-prefix",
	trustReturnsLabel: "trust-returns-label",
	drawerTitle: "drawer-title",
	drawerItemCount: "drawer-item-count",
	drawerAddForFreeShipping: "drawer-add-for-free-shipping",
	drawerFreeShippingQualified: "drawer-free-shipping-qualified",
	drawerSubtotal: "drawer-subtotal",
	drawerShipping: "drawer-shipping",
	drawerShippingFree: "drawer-shipping-free",
	drawerShippingCalculated: "drawer-shipping-calculated",
	drawerTotal: "drawer-total",
	drawerCheckout: "drawer-checkout",
	drawerContinueShopping: "drawer-continue-shopping",
	drawerRemoveItem: "drawer-remove-item",
	drawerDecreaseQuantity: "drawer-decrease-quantity",
	drawerIncreaseQuantity: "drawer-increase-quantity",
	pageTitle: "page-title",
	pageQuantity: "page-quantity",
	pageVariant: "page-variant",
	pageYourTotal: "page-your-total",
	pageShippingNote: "page-shipping-note",
	pageCheckout: "page-checkout",
} as const;

export const STOREFRONT_CHECKOUT_ATTRIBUTES = {
	emptyCartTitle: "empty-cart-title",
	emptyCartBody: "empty-cart-body",
	emptyCartStartLabel: "empty-cart-start-label",
	emptyCartGoBackLabel: "empty-cart-go-back-label",
	emptySessionTitle: "empty-session-title",
	emptySessionMessage: "empty-session-message",
	marketingOptInLabel: "marketing-opt-in-label",
	trustSecureCheckout: "trust-secure-checkout",
	trustStripeProcessor: "trust-stripe-processor",
} as const;
