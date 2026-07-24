import { type Metadata } from "next";
import { seoConfig, getMetadataBase } from "./config";
import { buildLocaleHreflangAlternates } from "./hreflang";
import { getLocaleDefinition, getStorefrontLocaleSlugs, type LocaleSlug } from "@/config/locale";
import { getConfiguredLocaleChannelPairs } from "@/config/locale-channel";
import { parseEditorJSToText } from "@/lib/editorjs";
import { buildStorefrontPath } from "@/lib/storefront-path";

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

	// OpenGraph defaults. No static `og:locale` here — the storefront locale layout
	// (`(storefront)/[locale]/layout.tsx`) derives it from the URL segment, and browse
	// pages set it via `buildBrowsePageMetadata`.
	...(seoConfig.enableOpenGraph && {
		openGraph: {
			type: "website",
			siteName: seoConfig.siteName,
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
 * Catalog / CMS SEO description: prefer the dedicated SEO field, then plain text from
 * the translated Editor.js body, then the entity name. Shared by metadata + JSON-LD so
 * those surfaces cannot drift.
 */
export function resolveSeoDescription(options: {
	seoDescription?: string | null;
	/** Editor.js JSON or plain text — run through {@link parseEditorJSToText} */
	body?: string | null;
	fallbackName: string;
}): string {
	const fromSeo = options.seoDescription?.trim();
	if (fromSeo) return fromSeo;
	const fromBody = parseEditorJSToText(options.body)?.trim();
	if (fromBody) return fromBody;
	return options.fallbackName;
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
	/** hreflang map — keys are language-only, BCP 47 region form, or `x-default` */
	languages?: Record<string, string>;
	/** `og:locale` (e.g. `ja_JP`) — set from the URL locale on browse pages */
	ogLocale?: string;
	/** `og:locale:alternate` — other locales this page is published in */
	ogAlternateLocale?: string[];
	/**
	 * `og:type`. Next's metadata API rejects OG protocol types outside its union
	 * (e.g. `product`) at runtime and drops the page's entire metadata — so for
	 * `product` we omit the tag here and the PDP shell hoists
	 * `<meta property="og:type" content="product">` only after the product resolves
	 * (never on the 404 path).
	 */
	ogType?: "website" | "product";
	/** Additional OpenGraph properties */
	openGraph?: Record<string, string>;
}): Metadata {
	const {
		title,
		description,
		image,
		url,
		languages,
		ogLocale,
		ogAlternateLocale,
		ogType = "website",
		openGraph: extraOg,
	} = options;

	// Truncate for optimal display
	const truncatedTitle = truncateText(title, 60);
	const truncatedDescription = description ? truncateText(description, 155) : undefined;

	// Never let callers smuggle `type: "product"` (or any unknown type) through the
	// OpenGraph passthrough — Next throws E237 and drops the page's entire metadata.
	const { type: _forbiddenOgType, ...safeExtraOg } = (extraOg ?? {}) as Record<string, string> & {
		type?: string;
	};

	return {
		title: truncatedTitle,
		description: truncatedDescription,

		// Canonical URL + hreflang
		...(url && {
			alternates: {
				canonical: url,
				...(languages && Object.keys(languages).length > 0 ? { languages } : {}),
			},
		}),

		// OpenGraph
		...(seoConfig.enableOpenGraph && {
			openGraph: {
				...(ogType === "website" && { type: "website" }),
				title: truncatedTitle,
				description: truncatedDescription,
				url,
				...(ogLocale && { locale: ogLocale }),
				...(ogAlternateLocale && ogAlternateLocale.length > 0 && { alternateLocale: ogAlternateLocale }),
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
				...safeExtraOg,
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

/** Browse metadata with canonical `/{locale}/{channel}/…` URL and locale hreflang alternates. */
export function buildBrowsePageMetadata(options: {
	title: string;
	description?: string;
	image?: string | null;
	locale: string;
	channel: string;
	/** Path after locale/channel for this page, e.g. `/products/hoodie` */
	pathSuffix: string;
	/**
	 * Optional per-locale path suffixes for hreflang (translated catalog slugs).
	 * Canonical URL still uses `pathSuffix` for the current locale.
	 */
	pathSuffixByLocale?: Record<string, string>;
	/** See {@link buildPageMetadata} — `product` omits og:type (PDP shell hoists after resolve). */
	ogType?: "website" | "product";
	openGraph?: Record<string, string>;
}): Metadata {
	const url = buildStorefrontPath(options.locale, options.channel, options.pathSuffix);
	const languages = buildLocaleHreflangAlternates(
		options.channel,
		options.pathSuffixByLocale ?? options.pathSuffix,
	);

	const ogLocale = getLocaleDefinition(options.locale)?.ogLocale;
	const ogAlternateLocale = getBrowseOgAlternateLocales(options.locale);

	return buildPageMetadata({
		title: options.title,
		description: options.description,
		image: options.image,
		url,
		languages,
		ogLocale,
		ogAlternateLocale,
		ogType: options.ogType,
		openGraph: options.openGraph,
	});
}

/**
 * Locales advertised as `og:locale:alternate`.
 * When a locale×channel matrix is configured, only locales that appear in the matrix
 * (same set as hreflang) — never every `STOREFRONT_LOCALES` entry, which may include
 * languages with no valid browse URL.
 */
function getBrowseOgAlternateLocales(currentLocale: string): string[] {
	const pairs = getConfiguredLocaleChannelPairs();
	const slugs: readonly LocaleSlug[] = pairs
		? [...new Set(pairs.map((pair) => pair.locale))]
		: getStorefrontLocaleSlugs();

	return slugs
		.filter((slug) => slug !== currentLocale)
		.map((slug) => getLocaleDefinition(slug)?.ogLocale)
		.filter((value): value is string => Boolean(value));
}
