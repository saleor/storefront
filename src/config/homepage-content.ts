import { brandConfig } from "@/config/brand";

/**
 * Homepage copy and section settings.
 * Edit this file (or compose directly in page.tsx) to customize the default homepage.
 */
export const homepageContent = {
	hero: {
		heading: "Discover our collection",
		subheading: brandConfig.tagline,
		primaryCtaLabel: "Shop all",
	},
	featuredCollection: {
		heading: "Featured products",
		limit: 8,
	},
	brandStory: {
		heading: "Built for real commerce",
		paragraphs: [
			"Paper is a minimal, production-ready storefront for Saleor — clean as a blank page, built to ship.",
			"Customize sections in code, connect your catalog, and keep checkout, cart, and product pages battle-tested out of the box.",
		],
	},
	values: {
		heading: "Why shop with us",
		columns: [
			{
				title: "Curated quality",
				text: "Every product is selected for craftsmanship and longevity — not trend-chasing.",
			},
			{
				title: "Fast fulfillment",
				text: "Orders ship from regional warehouses with tracking from checkout to delivery.",
			},
			{
				title: "Easy returns",
				text: "Hassle-free returns within 30 days. We stand behind what we sell.",
			},
		],
		columnsDesktop: 3 as const,
	},
	editorial: {
		heading: "Designed to last",
		paragraphs: [
			"Thoughtful materials and timeless silhouettes — pieces you'll reach for season after season.",
		],
		imagePosition: "right" as const,
		ctaLabel: "Explore collections",
	},
} as const;
