import type { Metadata } from "next";
import { SITE_CONFIG, DEFAULT_SEO } from "./constants";
import type { SEOProps, StructuredDataProps } from "@/types/seo";

/**
 * Generate meta tags for SEO from SEO props
 */
export function generateMetaTags(props: SEOProps) {
	const title = props.title || DEFAULT_SEO.title;
	const description = props.description || DEFAULT_SEO.description;
	const image = props.image || DEFAULT_SEO.image;
	const imageAlt = props.imageAlt || title;
	const type = props.type || DEFAULT_SEO.type;
	const canonical = props.canonical;

	// Construct full image URL
	const fullImageUrl = image.startsWith("http") ? image : `${SITE_CONFIG.url}${image}`;

	// Construct canonical URL
	const canonicalUrl = canonical || SITE_CONFIG.url;

	// Robots meta
	const robots: string[] = [];
	if (props.noindex) robots.push("noindex");
	if (props.nofollow) robots.push("nofollow");
	const robotsString = robots.length > 0 ? robots.join(", ") : "index, follow";

	return {
		title,
		description,
		canonical: canonicalUrl,
		robots: robotsString,
		openGraph: {
			title,
			description,
			url: canonicalUrl,
			image: fullImageUrl,
			imageAlt,
			type,
			siteName: SITE_CONFIG.name,
			locale: SITE_CONFIG.locale,
			imageWidth: 1200,
			imageHeight: 630,
		},
		twitter: {
			card: "summary_large_image" as const,
			site: SITE_CONFIG.twitter.site,
			creator: SITE_CONFIG.twitter.creator,
			title,
			description,
			image: fullImageUrl,
			imageAlt,
		},
	};
}

/**
 * Generate Next.js metadata object from SEO props
 */
export function generateMetadata(props: SEOProps): Metadata {
	const meta = generateMetaTags(props);

	const metadata: Metadata = {
		title: meta.title,
		description: meta.description,
		robots: meta.robots,
		openGraph: {
			title: meta.openGraph.title,
			description: meta.openGraph.description,
			url: meta.openGraph.url,
			siteName: meta.openGraph.siteName,
			locale: meta.openGraph.locale,
			type: meta.openGraph.type as any,
			images: [
				{
					url: meta.openGraph.image,
					width: meta.openGraph.imageWidth,
					height: meta.openGraph.imageHeight,
					alt: meta.openGraph.imageAlt,
				},
			],
		},
		twitter: {
			card: meta.twitter.card,
			site: meta.twitter.site,
			creator: meta.twitter.creator,
			title: meta.twitter.title,
			description: meta.twitter.description,
			images: [
				{
					url: meta.twitter.image,
					alt: meta.twitter.imageAlt,
				},
			],
		},
		alternates: {
			canonical: meta.canonical,
		},
	};

	// Add article-specific metadata if type is article
	if (props.type === "article" && (props.publishedTime || props.modifiedTime || props.author)) {
		metadata.openGraph = {
			...metadata.openGraph,
			type: "article",
			publishedTime: props.publishedTime,
			modifiedTime: props.modifiedTime,
			authors: props.author ? [props.author] : undefined,
		};
	}

	return metadata;
}

/**
 * Generate organization structured data (MusicGroup for Sonic Drive Studio)
 */
export function generateOrganizationSchema(): StructuredDataProps {
	return {
		"@context": "https://schema.org",
		"@type": "MusicGroup",
		name: SITE_CONFIG.name,
		url: SITE_CONFIG.url,
		logo: `${SITE_CONFIG.url}/images/logo.png`,
		description: SITE_CONFIG.description,
		sameAs: Object.values(SITE_CONFIG.social),
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			email: SITE_CONFIG.contact.email,
			url: `${SITE_CONFIG.url}/contact`,
		},
	};
}

/**
 * Generate website structured data
 */
export function generateWebsiteSchema(): StructuredDataProps {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: SITE_CONFIG.name,
		url: SITE_CONFIG.url,
		description: SITE_CONFIG.description,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};
}

/**
 * Generate product structured data
 */
export function generateProductSchema(product: {
	name: string;
	description?: string;
	image?: string;
	price?: string;
	currency?: string;
	availability?: string;
	brand?: string;
	sku?: string;
	gtin?: string;
}): StructuredDataProps {
	const schema: StructuredDataProps = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description: product.description,
		image: product.image ? `${SITE_CONFIG.url}${product.image}` : undefined,
		brand: product.brand
			? {
					"@type": "Brand",
					name: product.brand,
				}
			: undefined,
		sku: product.sku,
		gtin: product.gtin,
	};

	if (product.price && product.currency) {
		schema.offers = {
			"@type": "Offer",
			price: product.price,
			priceCurrency: product.currency,
			availability: product.availability || "https://schema.org/InStock",
			url: SITE_CONFIG.url,
		};
	}

	return schema;
}

/**
 * Generate breadcrumb list structured data
 */
export function generateBreadcrumbSchema(
	items: Array<{ name: string; url: string }>,
): StructuredDataProps {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: `${SITE_CONFIG.url}${item.url}`,
		})),
	};
}
