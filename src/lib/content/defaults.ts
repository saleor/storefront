import { brandConfig } from "@/config/brand";
import { STOREFRONT_CONTENT_VERSION, type StorefrontContent } from "@/lib/content/types";

/**
 * Code fallback for all storefront marketing copy.
 * Saleor PageType overrides merge on top when CONTENT_PROVIDER=saleor.
 *
 * English SoT for editorial copy — export to Configurator seed: pnpm content:export-seed
 */
export const defaultStorefrontContent = {
	version: STOREFRONT_CONTENT_VERSION,
	// Single source of truth for channel-wide facts. Copy references these via
	// `{freeShippingThreshold}` / `{returnsWindowDays}` tokens instead of baking the
	// numbers into strings, so the cart math, announcement, and trust labels never drift.
	policies: {
		shipping: {
			freeShippingThreshold: 75,
		},
		returns: {
			windowDays: 30,
		},
	},
	chrome: {
		announcementBar: {
			id: "",
			message: "Free shipping on orders over {freeShippingThreshold}",
			href: null,
			linkLabel: null,
			dismissible: true,
		},
		nav: {
			allProductsLabel: "All",
			viewAllLabel: "View all {label}",
		},
	},
	surfaces: {
		homepage: {
			hero: {
				heading: "Discover our collection",
				subheading: brandConfig.tagline,
				primaryCtaLabel: "Shop all",
			},
			featuredCollection: {
				heading: "Featured products",
				collectionSlug: "featured-products",
				limit: 8,
			},
			categories: {
				heading: "Shop by category",
			},
			photoCredits: [],
			brandStory: {
				heading: "Our story",
				paragraphs: [
					"Tell shoppers who you are and what you stand for.",
					"Edit this copy in Dashboard → Models → Storefront — Homepage.",
				],
			},
			values: {
				heading: "Why shop with us",
				columns: [
					{
						title: "Quality",
						text: "Share what makes your products worth choosing.",
					},
					{
						title: "Shipping",
						text: "Describe how and when orders arrive.",
					},
					{
						title: "Returns",
						text: "Easy returns within {returnsWindowDays} days.",
					},
				],
				columnsDesktop: 3,
			},
			editorial: {
				heading: "From the shop",
				paragraphs: ["Highlight a collection, seasonal story, or campaign — then edit this block in Models."],
				imagePosition: "right",
				ctaLabel: "Explore collections",
				image: null,
				imageAlt: "",
			},
		},
		products: {
			title: "All Products",
			description: "Browse our full catalog.",
		},
		cart: {
			empty: {
				title: "Your bag is empty",
				body: "Looks like you haven't added anything to your bag yet.",
				ctaLabel: "Start Shopping",
			},
			trust: {
				freeShippingPrefix: "Free delivery over",
				returnsLabel: "{returnsWindowDays}-day returns",
			},
			drawer: {
				title: "Your Bag",
				addForFreeShipping: "Add {amount} more for free shipping",
				freeShippingQualified: "You qualify for free shipping!",
			},
		},
		checkout: {
			emptyCart: {
				title: "Your cart is empty",
				body: "Looks like you haven't added anything to your cart yet.",
				startShoppingLabel: "Start Shopping",
				goBackLabel: "Go back",
			},
			emptySession: {
				title: "Your cart is empty",
				message: "Add items from the store, then return here to complete your purchase.",
			},
			marketingOptInLabel: "Email me with news and offers",
			trust: {
				secureCheckout: "Secure checkout",
				stripeProcessor: "Payments processed by Stripe",
			},
		},
	},
} satisfies StorefrontContent;
