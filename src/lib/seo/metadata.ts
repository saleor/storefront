import { type Metadata } from "next";
import { seoConfig, getMetadataBase } from "./config";

/**
 * Root Metadata
 *
 * Default metadata for the entire site.
 * Import and export this from your root layout.tsx
 *
 * @example
 * // In src/app/layout.tsx
 * export { rootMetadata as metadata } from "@/lib/seo";
 */
export const rootMetadata: Metadata = {
	// Title configuration
	title: {
		default: seoConfig.siteName,
		template: seoConfig.titleTemplate,
	},
	description: seoConfig.description,

	// Base URL for resolving relative URLs
	metadataBase: getMetadataBase(),

	// OpenGraph defaults
	...(seoConfig.enableOpenGraph && {
		openGraph: {
			type: "website",
			siteName: seoConfig.siteName,
			locale: seoConfig.locale,
			images: [
				{
					url: "/opengraph-image.png",
					width: 1200,
					height: 630,
					alt: seoConfig.siteName,
				},
			],
		},
	}),

	// Twitter/X card defaults
	...(seoConfig.enableTwitterCards && {
		twitter: {
			card: "summary_large_image",
			...(seoConfig.twitterHandle && {
				site: `@${seoConfig.twitterHandle}`,
				creator: `@${seoConfig.twitterHandle}`,
			}),
		},
	}),

	// Icons - with light/dark mode support
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "32x32" },
			// Light mode (dark icon on light tabs)
			{
				url: "/favicon-16x16.png",
				sizes: "16x16",
				type: "image/png",
				media: "(prefers-color-scheme: light)",
			},
			{
				url: "/favicon-32x32.png",
				sizes: "32x32",
				type: "image/png",
				media: "(prefers-color-scheme: light)",
			},
			// Dark mode (light icon on dark tabs)
			{
				url: "/favicon-dark-16x16.png",
				sizes: "16x16",
				type: "image/png",
				media: "(prefers-color-scheme: dark)",
			},
			{
				url: "/favicon-dark-32x32.png",
				sizes: "32x32",
				type: "image/png",
				media: "(prefers-color-scheme: dark)",
			},
		],
		apple: "/apple-icon.png",
	},

	// Web App Manifest
	manifest: "/site.webmanifest",

	// Crawler configuration
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

/**
 * Truncate text to a maximum length at word boundary
 * Used for SEO-friendly titles and descriptions
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	const truncated = text.slice(0, maxLength);
	const lastSpace = truncated.lastIndexOf(" ");
	return lastSpace > 0 ? truncated.slice(0, lastSpace) + "…" : truncated + "…";
}

/**
 * Build page metadata with OpenGraph and Twitter cards
 *
 * @example
 * export async function generateMetadata(): Promise<Metadata> {
 *   const product = await getProduct(slug);
 *   return buildPageMetadata({
 *     title: product.name,
 *     description: product.description,
 *     image: product.thumbnail?.url,
 *     url: `/products/${slug}`,
 *   });
 * }
 */
export function buildPageMetadata(options: {
	title: string;
	description?: string;
	image?: string | null;
	url?: string;
	/** Additional OpenGraph properties */
	openGraph?: Record<string, string>;
}): Metadata {
	const { title, description, image, url, openGraph: extraOg } = options;

	// Truncate for optimal display
	const truncatedTitle = truncateText(title, 60);
	const truncatedDescription = description ? truncateText(description, 155) : undefined;

	return {
		title: truncatedTitle,
		description: truncatedDescription,

		// Canonical URL
		...(url && {
			alternates: {
				canonical: url,
			},
		}),

		// OpenGraph
		...(seoConfig.enableOpenGraph && {
			openGraph: {
				type: "website",
				title: truncatedTitle,
				description: truncatedDescription,
				url,
				images: image
					? [
							{
								url: image,
								width: 1200,
								height: 630,
								alt: title,
							},
						]
					: undefined,
				...extraOg,
			},
		}),

		// Twitter
		...(seoConfig.enableTwitterCards && {
			twitter: {
				card: "summary_large_image",
				title: truncatedTitle,
				description: truncatedDescription,
				images: image ? [image] : undefined,
			},
		}),
	};
}
