/**
 * @deprecated This file is deprecated. Content is now fetched dynamically from Saleor CMS.
 *
 * Use the content service instead:
 * - import { getHeroContent, getTrustBadges, getShopInfo } from "@/lib/content";
 *
 * This file is kept as a reference for fallback values used in src/lib/content.ts
 * when the Saleor API is unavailable.
 */

// Homepage Configuration (DEPRECATED - see above)

export type TrustBadgeIcon = "truck" | "rotate" | "shield" | "credit-card";

export interface HeroStat {
	value: string;
	label: string;
}

export interface HeroCta {
	text: string;
	href: string;
}

export interface HeroConfig {
	badge: string;
	headline: string;
	headlineAccent: string;
	description: string;
	primaryCta: HeroCta;
	secondaryCta: HeroCta;
	stats: HeroStat[];
}

export interface TrustBadge {
	icon: TrustBadgeIcon;
	title: string;
	description: string;
}

export interface WhatsAppConfig {
	enabled: boolean;
	phoneNumber: string;
	message: string;
	tooltip: string;
}

export interface HomepageConfig {
	hero: HeroConfig;
	trustBadges: TrustBadge[];
	whatsApp: WhatsAppConfig;
}

export const homepageConfig: HomepageConfig = {
	hero: {
		badge: "✨ New Season Collection",
		headline: "Discover Your",
		headlineAccent: "Perfect Style",
		description:
			"Explore our curated collection of premium products. From fashion to electronics, find everything you need with free shipping on orders over $50.",
		primaryCta: {
			text: "Shop Now",
			href: "/products",
		},
		secondaryCta: {
			text: "View Collections",
			href: "/collections/featured-products",
		},
		stats: [
			{ value: "1000+", label: "Products" },
			{ value: "24/7", label: "Support" },
			{ value: "Free", label: "Shipping 6000+" },
		],
	},
	trustBadges: [
		{
			icon: "truck",
			title: "Free Shipping",
			description: "On orders over 6000",
		},
		{
			icon: "rotate",
			title: "Easy Returns",
			description: "30-day return policy",
		},
		{
			icon: "shield",
			title: "Secure Checkout",
			description: "SSL encrypted payment",
		},
		{
			icon: "credit-card",
			title: "Flexible Payment",
			description: "Multiple payment options",
		},
	],
	whatsApp: {
		enabled: true,
		phoneNumber: "0799147287", // Replace with your WhatsApp number
		message: "Hi! I have a question about Luxior Mall.",
		tooltip: "Chat with us on WhatsApp",
	},
};
