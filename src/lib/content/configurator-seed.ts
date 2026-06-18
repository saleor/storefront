import { stringify } from "yaml";
import { STOREFRONT_POLICY_PAGE_SLUG, STOREFRONT_PAGE_TYPES } from "@/lib/content/constants";
import type { StorefrontContent } from "@/lib/content/types";

/** Configurator `models:` entry — attribute keys are contentAttribute display names. */
export type ConfiguratorSeedModel = {
	title: string;
	slug: string;
	modelType: string;
	isPublished: true;
	attributes: Record<string, string | number | boolean>;
};

/** Display names from config/saleor/storefront-content.config.yml `contentAttributes`. */
const ATTR = {
	freeShippingThreshold: "Free shipping threshold",
	returnsWindowDays: "Returns window days",
	announcementId: "Announcement ID",
	announcementMessage: "Announcement message",
	announcementDismissible: "Announcement dismissible",
	navAllProductsLabel: "Nav all products label",
	navViewAllLabel: "Nav view all label",
	listingTitle: "Listing title",
	listingDescription: "Listing description",
	heroHeading: "Hero heading",
	heroSubheading: "Hero subheading",
	heroCtaLabel: "Hero CTA label",
	featuredHeading: "Featured heading",
	featuredCollection: "Featured collection",
	featuredLimit: "Featured limit",
	brandStoryHeading: "Brand story heading",
	brandStoryParagraph1: "Brand story paragraph 1",
	brandStoryParagraph2: "Brand story paragraph 2",
	valuesHeading: "Values heading",
	valuesColumnsDesktop: "Values columns desktop",
	valuesColumn1Title: "Values column 1 title",
	valuesColumn1Text: "Values column 1 text",
	valuesColumn2Title: "Values column 2 title",
	valuesColumn2Text: "Values column 2 text",
	valuesColumn3Title: "Values column 3 title",
	valuesColumn3Text: "Values column 3 text",
	editorialHeading: "Editorial heading",
	editorialParagraph1: "Editorial paragraph 1",
	editorialImagePosition: "Editorial image position",
	editorialCtaLabel: "Editorial CTA label",
	emptyTitle: "Empty title",
	emptyBody: "Empty body",
	emptyCtaLabel: "Empty CTA label",
	trustFreeShippingPrefix: "Trust free shipping prefix",
	trustReturnsLabel: "Trust returns label",
	drawerTitle: "Drawer title",
	drawerAddForFreeShipping: "Drawer add for free shipping",
	drawerFreeShippingQualified: "Drawer free shipping qualified",
	emptyCartTitle: "Empty cart title",
	emptyCartBody: "Empty cart body",
	emptyCartStartLabel: "Empty cart start label",
	emptyCartGoBackLabel: "Empty cart go back label",
	emptySessionTitle: "Empty session title",
	emptySessionMessage: "Empty session message",
	marketingOptInLabel: "Marketing opt-in label",
	trustSecureCheckout: "Trust secure checkout",
	trustStripeProcessor: "Trust Stripe processor",
} as const;

/** Build Configurator seed models from the code-owned EN defaults (`defaults.ts`). */
export function buildConfiguratorSeedModels(content: StorefrontContent): ConfiguratorSeedModel[] {
	const { policies, chrome, surfaces } = content;
	const freeShippingThreshold = policies.shipping.freeShippingThreshold;

	if (freeShippingThreshold === null) {
		throw new Error(
			"Cannot export storefront seed: policies.shipping.freeShippingThreshold is null. " +
				"Set a numeric threshold in defaults.ts or omit the policy from the seed export.",
		);
	}

	return [
		{
			title: "Storefront Policies",
			slug: STOREFRONT_POLICY_PAGE_SLUG,
			modelType: "Storefront — Policies",
			isPublished: true,
			attributes: {
				[ATTR.freeShippingThreshold]: freeShippingThreshold,
				[ATTR.returnsWindowDays]: policies.returns.windowDays,
			},
		},
		{
			title: "Storefront Chrome",
			slug: STOREFRONT_PAGE_TYPES.chrome,
			modelType: "Storefront — Chrome",
			isPublished: true,
			attributes: {
				[ATTR.announcementId]: chrome.announcementBar.id,
				[ATTR.announcementMessage]: chrome.announcementBar.message,
				[ATTR.announcementDismissible]: chrome.announcementBar.dismissible,
				[ATTR.navAllProductsLabel]: chrome.nav.allProductsLabel,
				[ATTR.navViewAllLabel]: chrome.nav.viewAllLabel,
			},
		},
		{
			title: "Storefront Products",
			slug: STOREFRONT_PAGE_TYPES.products,
			modelType: "Storefront — Products",
			isPublished: true,
			attributes: {
				[ATTR.listingTitle]: surfaces.products.title,
				[ATTR.listingDescription]: surfaces.products.description,
			},
		},
		{
			title: "Storefront Homepage",
			slug: STOREFRONT_PAGE_TYPES.homepage,
			modelType: "Storefront — Homepage",
			isPublished: true,
			attributes: {
				[ATTR.heroHeading]: surfaces.homepage.hero.heading,
				[ATTR.heroSubheading]: surfaces.homepage.hero.subheading,
				[ATTR.heroCtaLabel]: surfaces.homepage.hero.primaryCtaLabel,
				[ATTR.featuredHeading]: surfaces.homepage.featuredCollection.heading,
				[ATTR.featuredCollection]: surfaces.homepage.featuredCollection.collectionSlug,
				[ATTR.featuredLimit]: surfaces.homepage.featuredCollection.limit,
				[ATTR.brandStoryHeading]: surfaces.homepage.brandStory.heading,
				[ATTR.brandStoryParagraph1]: surfaces.homepage.brandStory.paragraphs[0] ?? "",
				[ATTR.brandStoryParagraph2]: surfaces.homepage.brandStory.paragraphs[1] ?? "",
				[ATTR.valuesHeading]: surfaces.homepage.values.heading,
				[ATTR.valuesColumnsDesktop]: surfaces.homepage.values.columnsDesktop,
				[ATTR.valuesColumn1Title]: surfaces.homepage.values.columns[0]?.title ?? "",
				[ATTR.valuesColumn1Text]: surfaces.homepage.values.columns[0]?.text ?? "",
				[ATTR.valuesColumn2Title]: surfaces.homepage.values.columns[1]?.title ?? "",
				[ATTR.valuesColumn2Text]: surfaces.homepage.values.columns[1]?.text ?? "",
				[ATTR.valuesColumn3Title]: surfaces.homepage.values.columns[2]?.title ?? "",
				[ATTR.valuesColumn3Text]: surfaces.homepage.values.columns[2]?.text ?? "",
				[ATTR.editorialHeading]: surfaces.homepage.editorial.heading,
				[ATTR.editorialParagraph1]: surfaces.homepage.editorial.paragraphs[0] ?? "",
				[ATTR.editorialImagePosition]: surfaces.homepage.editorial.imagePosition,
				[ATTR.editorialCtaLabel]: surfaces.homepage.editorial.ctaLabel,
			},
		},
		{
			title: "Storefront Cart",
			slug: STOREFRONT_PAGE_TYPES.cart,
			modelType: "Storefront — Cart",
			isPublished: true,
			attributes: {
				[ATTR.emptyTitle]: surfaces.cart.empty.title,
				[ATTR.emptyBody]: surfaces.cart.empty.body,
				[ATTR.emptyCtaLabel]: surfaces.cart.empty.ctaLabel,
				[ATTR.trustFreeShippingPrefix]: surfaces.cart.trust.freeShippingPrefix,
				[ATTR.trustReturnsLabel]: surfaces.cart.trust.returnsLabel,
				[ATTR.drawerTitle]: surfaces.cart.drawer.title,
				[ATTR.drawerAddForFreeShipping]: surfaces.cart.drawer.addForFreeShipping,
				[ATTR.drawerFreeShippingQualified]: surfaces.cart.drawer.freeShippingQualified,
			},
		},
		{
			title: "Storefront Checkout",
			slug: STOREFRONT_PAGE_TYPES.checkout,
			modelType: "Storefront — Checkout",
			isPublished: true,
			attributes: {
				[ATTR.emptyCartTitle]: surfaces.checkout.emptyCart.title,
				[ATTR.emptyCartBody]: surfaces.checkout.emptyCart.body,
				[ATTR.emptyCartStartLabel]: surfaces.checkout.emptyCart.startShoppingLabel,
				[ATTR.emptyCartGoBackLabel]: surfaces.checkout.emptyCart.goBackLabel,
				[ATTR.emptySessionTitle]: surfaces.checkout.emptySession.title,
				[ATTR.emptySessionMessage]: surfaces.checkout.emptySession.message,
				[ATTR.marketingOptInLabel]: surfaces.checkout.marketingOptInLabel,
				[ATTR.trustSecureCheckout]: surfaces.checkout.trust.secureCheckout,
				[ATTR.trustStripeProcessor]: surfaces.checkout.trust.stripeProcessor,
			},
		},
	];
}

/** YAML document for the Configurator `models:` block (includes the `models:` key). */
export function formatConfiguratorSeedYamlSection(content: StorefrontContent): string {
	return stringify({ models: buildConfiguratorSeedModels(content) }, { lineWidth: 100 });
}

/** Stable JSON for comparing YAML seed models to code export (order-normalized). */
export function serializeConfiguratorSeedModels(models: ConfiguratorSeedModel[]): string {
	const normalized = [...models]
		.sort((a, b) => a.slug.localeCompare(b.slug))
		.map((model) => ({
			...model,
			attributes: Object.fromEntries(Object.entries(model.attributes).sort(([a], [b]) => a.localeCompare(b))),
		}));
	return JSON.stringify(normalized, null, 2);
}
