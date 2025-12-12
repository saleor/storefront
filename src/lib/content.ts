/**
 * Content Service
 * Fetches dynamic content from Saleor API with fallback support
 */

import { executeGraphQL } from "./graphql";
import { ShopSettingsDocument, SiteContentBySlugDocument, TrustBadgesContentDocument } from "@/gql/graphql";

// ============================================================================
// Type Definitions
// ============================================================================

export type TrustBadgeIcon = "truck" | "rotate" | "shield" | "credit-card";

export interface TrustBadge {
	icon: TrustBadgeIcon;
	title: string;
	description: string;
	sortOrder?: number;
}

export interface HeroStat {
	value: string;
	label: string;
}

export interface HeroCta {
	text: string;
	href: string;
}

export interface HeroContent {
	badge: string;
	headline: string;
	headlineAccent: string;
	description: string;
	primaryCta: HeroCta;
	secondaryCta: HeroCta;
	stats: HeroStat[];
}

export interface ShopInfo {
	name: string;
	description: string;
	socialLinks: {
		facebook?: string;
		instagram?: string;
		twitter?: string;
	};
	paymentMethods: string[];
	whatsApp?: {
		phoneNumber: string;
		message: string;
	};
}

export interface StorePolicy {
	freeShippingThreshold: string;
	returnPeriodDays: number;
	shippingContent?: string;
	returnsContent?: string;
}

// ============================================================================
// Cache Revalidation Periods (in seconds)
// ============================================================================

const CACHE_REVALIDATE = {
	SHOP_SETTINGS: 60 * 60, // 1 hour
	TRUST_BADGES: 60 * 60, // 1 hour
	HERO_CONTENT: 60 * 60, // 1 hour
	STORE_POLICIES: 60 * 60 * 24, // 24 hours
};

// ============================================================================
// Fallback Constants
// ============================================================================

const FALLBACK_TRUST_BADGES: TrustBadge[] = [
	{ icon: "truck", title: "Free Shipping", description: "On orders over 6000" },
	{ icon: "rotate", title: "Easy Returns", description: "30-day return policy" },
	{ icon: "shield", title: "Secure Checkout", description: "SSL encrypted payment" },
	{ icon: "credit-card", title: "Flexible Payment", description: "Multiple payment options" },
];

const FALLBACK_HERO: HeroContent = {
	badge: "✨ New Season Collection",
	headline: "Discover Your",
	headlineAccent: "Perfect Style",
	description:
		"Explore our curated collection of premium products. From fashion to electronics, find everything you need with free shipping on orders over $50.",
	primaryCta: { text: "Shop Now", href: "/products" },
	secondaryCta: { text: "View Collections", href: "/collections" },
	stats: [
		{ value: "1000+", label: "Products" },
		{ value: "24/7", label: "Support" },
		{ value: "Free", label: "Shipping 6000+" },
	],
};

const FALLBACK_SHOP_INFO: ShopInfo = {
	name: "Luxior Mall",
	description: "Your premium shopping destination for quality products.",
	socialLinks: {},
	paymentMethods: ["visa", "mastercard", "mpesa"],
	whatsApp: {
		phoneNumber: "0799147287",
		message: "Hi! I have a question about Luxior Mall.",
	},
};

const FALLBACK_STORE_POLICIES: StorePolicy = {
	freeShippingThreshold: "6000",
	returnPeriodDays: 30,
	shippingContent: "Free shipping on orders over KES 6,000. Standard delivery within 3-5 business days.",
	returnsContent: "30-day hassle-free returns. Items must be unused and in original packaging.",
};

// ============================================================================
// Content Fetching Functions
// ============================================================================

/**
 * Fetches shop information from Saleor API
 * Includes store name, description, social links, payment methods, and WhatsApp config
 */
export async function getShopInfo(): Promise<ShopInfo> {
	try {
		const data = await executeGraphQL(ShopSettingsDocument, {
			revalidate: CACHE_REVALIDATE.SHOP_SETTINGS,
			withAuth: false,
		});

		const shop = data.shop;
		const metafields = shop.metafields || {};

		// Parse payment methods from JSON string or use fallback
		let paymentMethods: string[] = FALLBACK_SHOP_INFO.paymentMethods;
		if (metafields.payment_methods) {
			try {
				const parsed = JSON.parse(metafields.payment_methods) as unknown;
				if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
					paymentMethods = parsed as string[];
				}
			} catch {
				// Keep fallback if parsing fails
			}
		}

		// Build WhatsApp config if phone number is provided
		let whatsApp: ShopInfo["whatsApp"] = undefined;
		if (metafields.whatsapp_number) {
			whatsApp = {
				phoneNumber: metafields.whatsapp_number,
				message: metafields.whatsapp_message || FALLBACK_SHOP_INFO.whatsApp?.message || "",
			};
		}

		return {
			name: shop.name || FALLBACK_SHOP_INFO.name,
			description: shop.description || FALLBACK_SHOP_INFO.description,
			socialLinks: {
				facebook: metafields.social_facebook || undefined,
				instagram: metafields.social_instagram || undefined,
				twitter: metafields.social_twitter || undefined,
			},
			paymentMethods,
			whatsApp,
		};
	} catch (error) {
		console.error("Failed to fetch shop info:", error);
		return FALLBACK_SHOP_INFO;
	}
}

/**
 * Validates if a string is a valid TrustBadgeIcon
 */
function isValidTrustBadgeIcon(icon: string): icon is TrustBadgeIcon {
	return ["truck", "rotate", "shield", "credit-card"].includes(icon);
}

/**
 * Fetches trust badges from Saleor Pages API
 * Pages are filtered by page_type metadata = "trust-badge"
 */
export async function getTrustBadges(): Promise<TrustBadge[]> {
	try {
		const data = await executeGraphQL(TrustBadgesContentDocument, {
			revalidate: CACHE_REVALIDATE.TRUST_BADGES,
			withAuth: false,
		});

		const pages = data.pages?.edges;
		if (!pages || pages.length === 0) {
			return FALLBACK_TRUST_BADGES;
		}

		const badges: TrustBadge[] = pages
			.map((edge) => {
				const node = edge.node;
				const metafields = node.metafields || {};

				const icon = metafields.icon || "shield";
				const sortOrder = metafields.sort_order ? parseInt(metafields.sort_order, 10) : 0;

				return {
					icon: isValidTrustBadgeIcon(icon) ? icon : "shield",
					title: node.title,
					description: metafields.description || node.content || "",
					sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
				};
			})
			.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

		return badges.length > 0 ? badges : FALLBACK_TRUST_BADGES;
	} catch (error) {
		console.error("Failed to fetch trust badges:", error);
		return FALLBACK_TRUST_BADGES;
	}
}

/**
 * Fetches hero content from Saleor Pages API
 * Looks for a page with slug "homepage-hero"
 */
export async function getHeroContent(slug: string = "homepage-hero"): Promise<HeroContent> {
	try {
		const data = await executeGraphQL(SiteContentBySlugDocument, {
			variables: { slug },
			revalidate: CACHE_REVALIDATE.HERO_CONTENT,
			withAuth: false,
		});

		const page = data.page;
		if (!page) {
			return FALLBACK_HERO;
		}

		const metafields = page.metafields || {};

		// Parse stats from JSON string
		let stats: HeroStat[] = FALLBACK_HERO.stats;
		if (metafields.stats) {
			try {
				const parsed = JSON.parse(metafields.stats) as unknown;
				if (
					Array.isArray(parsed) &&
					parsed.every(
						(item) =>
							typeof item === "object" &&
							item !== null &&
							"value" in item &&
							"label" in item &&
							typeof item.value === "string" &&
							typeof item.label === "string",
					)
				) {
					stats = parsed as HeroStat[];
				}
			} catch {
				// Keep fallback if parsing fails
			}
		}

		return {
			badge: metafields.badge_text || FALLBACK_HERO.badge,
			headline: metafields.headline || FALLBACK_HERO.headline,
			headlineAccent: metafields.headline_accent || FALLBACK_HERO.headlineAccent,
			description: metafields.description || page.content || FALLBACK_HERO.description,
			primaryCta: {
				text: metafields.cta_text || FALLBACK_HERO.primaryCta.text,
				href: metafields.cta_href || FALLBACK_HERO.primaryCta.href,
			},
			secondaryCta: {
				text: metafields.secondary_cta_text || FALLBACK_HERO.secondaryCta.text,
				href: metafields.secondary_cta_href || FALLBACK_HERO.secondaryCta.href,
			},
			stats,
		};
	} catch (error) {
		console.error("Failed to fetch hero content:", error);
		return FALLBACK_HERO;
	}
}

/**
 * Fetches store policies from Saleor Pages API
 * Looks for pages with slugs "policy-shipping" and "policy-returns"
 */
export async function getStorePolicies(): Promise<StorePolicy> {
	try {
		// Fetch both shipping and returns policies in parallel
		const [shippingData, returnsData] = await Promise.all([
			executeGraphQL(SiteContentBySlugDocument, {
				variables: { slug: "policy-shipping" },
				revalidate: CACHE_REVALIDATE.STORE_POLICIES,
				withAuth: false,
			}).catch(() => null),
			executeGraphQL(SiteContentBySlugDocument, {
				variables: { slug: "policy-returns" },
				revalidate: CACHE_REVALIDATE.STORE_POLICIES,
				withAuth: false,
			}).catch(() => null),
		]);

		const shippingPage = shippingData?.page;
		const returnsPage = returnsData?.page;

		// Extract values from metafields or use fallbacks
		const shippingMetafields = shippingPage?.metafields || {};
		const returnsMetafields = returnsPage?.metafields || {};

		const freeShippingThreshold =
			shippingMetafields.free_shipping_threshold || FALLBACK_STORE_POLICIES.freeShippingThreshold;

		const returnPeriodDays = returnsMetafields.return_period_days
			? parseInt(returnsMetafields.return_period_days, 10)
			: FALLBACK_STORE_POLICIES.returnPeriodDays;

		return {
			freeShippingThreshold,
			returnPeriodDays: isNaN(returnPeriodDays) ? FALLBACK_STORE_POLICIES.returnPeriodDays : returnPeriodDays,
			shippingContent:
				shippingMetafields.summary || shippingPage?.content || FALLBACK_STORE_POLICIES.shippingContent,
			returnsContent:
				returnsMetafields.summary || returnsPage?.content || FALLBACK_STORE_POLICIES.returnsContent,
		};
	} catch (error) {
		console.error("Failed to fetch store policies:", error);
		return FALLBACK_STORE_POLICIES;
	}
}
