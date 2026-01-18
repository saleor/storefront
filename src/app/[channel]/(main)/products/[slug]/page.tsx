import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import edjsHTML from "editorjs-html";
import xss from "xss";

import { executeGraphQL } from "@/lib/graphql";
import { ProductDetailsDocument, ProductListDocument, type ProductDetailsQuery } from "@/gql/graphql";
import { buildPageMetadata, buildProductJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/ui/components/breadcrumbs";
import {
	ProductGallery,
	ProductGalleryImage,
	ProductAttributes,
	VariantSectionDynamic,
	VariantSectionSkeleton,
} from "@/ui/components/pdp";

// ============================================================================
// Cached Data Fetching
// ============================================================================

/**
 * Cached product data fetching.
 *
 * With Cache Components, this data becomes part of the static shell,
 * making product pages load instantly while variant-specific UI streams in.
 */
async function getProductData(slug: string, channel: string) {
	"use cache";
	cacheLife("minutes"); // 5 minute cache
	cacheTag(`product:${slug}`); // Tag for on-demand revalidation

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(slug),
			channel,
		},
		revalidate: 300,
		withAuth: false, // Public data - no cookies in cache scope
	});

	return product;
}

// ============================================================================
// Metadata & Static Params
// ============================================================================

export async function generateMetadata(props: {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}): Promise<Metadata> {
	// Note: Can't use "use cache" here because we access searchParams (dynamic)
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);
	const product = await getProductData(params.slug, params.channel);

	if (!product) {
		notFound();
	}

	const selectedVariant = searchParams.variant
		? product.variants?.find(({ id }) => id === searchParams.variant)
		: null;
	const variantName = selectedVariant?.name;
	const description =
		product.seoDescription || (variantName ? `${product.name} - ${variantName}` : product.name);
	// Use variant image for OG if available, otherwise product image
	const ogImage = selectedVariant?.media?.[0]?.url || product.media?.[0]?.url || product.thumbnail?.url;
	const priceAmount = product.pricing?.priceRange?.start?.gross?.amount;
	const priceCurrency = product.pricing?.priceRange?.start?.gross?.currency;

	return buildPageMetadata({
		title: product.seoTitle || product.name,
		description,
		image: ogImage,
		url: `/${params.channel}/products/${encodeURIComponent(params.slug)}`,
		openGraph:
			priceAmount && priceCurrency
				? {
						"product:price:amount": String(priceAmount),
						"product:price:currency": priceCurrency,
					}
				: undefined,
	});
}

export async function generateStaticParams({ params }: { params: { channel: string } }) {
	const { getStaticProductSlugs, getStaticProductCollection, getStaticProductFetchCount } = await import(
		"@/config/static-pages"
	);

	const configuredSlugs = getStaticProductSlugs();
	if (configuredSlugs && configuredSlugs.length > 0) {
		return configuredSlugs.map((slug) => ({ slug }));
	}

	const collectionSlug = getStaticProductCollection();
	if (collectionSlug) {
		const { ProductListByCollectionDocument } = await import("@/gql/graphql");
		const { collection } = await executeGraphQL(ProductListByCollectionDocument, {
			revalidate: 300,
			variables: { slug: collectionSlug, channel: params.channel, first: 100 },
			withAuth: false,
		});
		return collection?.products?.edges.map(({ node: { slug } }) => ({ slug })) || [];
	}

	const { products } = await executeGraphQL(ProductListDocument, {
		revalidate: 300,
		variables: { first: getStaticProductFetchCount(), channel: params.channel },
		withAuth: false,
	});

	return products?.edges.map(({ node: { slug } }) => ({ slug })) || [];
}

// ============================================================================
// Page Component
// ============================================================================

const parser = edjsHTML();

/**
 * Product Detail Page with Cache Components.
 *
 * Architecture:
 * - Static Shell: Page layout, gallery, product name, description, attributes
 * - Cached: Product data from Saleor API (via getProductData with "use cache")
 * - Dynamic (Suspense): Variant selection, pricing, add-to-cart
 *
 * This gives users instant page loads with all static content visible,
 * while personalized/dynamic elements stream in seamlessly.
 */
export default async function ProductPage(props: {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const [params, searchParams] = await Promise.all([props.params, props.searchParams]);
	const product = await getProductData(params.slug, params.channel);

	if (!product) {
		notFound();
	}

	// Parse description (cached - part of static shell)
	const descriptionHtml = parseDescription(product.description);

	// Find selected variant (if any) for variant-specific images
	const selectedVariant = searchParams.variant
		? product.variants?.find((v) => v.id === searchParams.variant)
		: null;

	// Prepare images: use variant images if available, otherwise product images
	// This enables variant-specific galleries (e.g., different colors show different images)
	const images = getGalleryImages(product, selectedVariant);

	// Extract product attributes (cached)
	const productAttributes = extractProductAttributes(product);
	const careInstructions = extractCareInstructions(product);

	// Breadcrumbs (cached)
	const breadcrumbs = [
		{ label: "Home", href: `/${params.channel}` },
		...(product.category
			? [{ label: product.category.name, href: `/${params.channel}/categories/${product.category.slug}` }]
			: []),
		{ label: product.name },
	];

	// JSON-LD with base product info
	const productJsonLd = buildProductJsonLd({
		name: product.name,
		description: product.seoDescription || product.name,
		images: images.length > 0 ? images.map((img) => img.url) : undefined,
		brand: product.category?.name,
		url: `/${params.channel}/products/${product.slug}`,
		priceRange: product.pricing?.priceRange?.start?.gross
			? {
					lowPrice: product.pricing.priceRange.start.gross.amount,
					highPrice:
						product.pricing.priceRange.stop?.gross?.amount || product.pricing.priceRange.start.gross.amount,
					currency: product.pricing.priceRange.start.gross.currency,
				}
			: null,
		inStock: product.variants?.some((v) => v.quantityAvailable) ?? false,
		variantCount: product.variants?.length ?? 0,
	});

	const lcpImageUrl = images[0]?.url;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{/* Preload LCP image - part of static shell */}
			{lcpImageUrl && <link rel="preload" as="image" href={lcpImageUrl} fetchPriority="high" />}

			{/* JSON-LD - part of static shell */}
			{productJsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
				/>
			)}

			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
				{/* Breadcrumb - part of static shell */}
				<div className="mb-6 hidden sm:block">
					<Breadcrumbs items={breadcrumbs} />
				</div>

				{/* Product Grid */}
				<div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
					{/* Left Column - Gallery (cached/static) */}
					<div className="lg:sticky lg:top-24 lg:self-start">
						<ProductGallery images={images} productName={product.name}>
							{images[0] && <ProductGalleryImage src={images[0].url} alt={images[0].alt || product.name} />}
						</ProductGallery>
					</div>

					{/* Right Column - Product Info */}
					<div className="flex flex-col gap-3">
						{/* Product Name - static shell for SEO/LCP, order:2 so Category appears above */}
						<h1 className="order-2 text-balance text-3xl font-semibold tracking-tight lg:text-4xl">
							{product.name}
						</h1>

						{/* Variant Section - DYNAMIC (streams at request time), order:1 for Category row, order:3 for rest */}
						<Suspense fallback={<VariantSectionSkeleton />}>
							<VariantSectionDynamic
								product={product}
								channel={params.channel}
								searchParams={props.searchParams}
							/>
						</Suspense>

						{/* Product Details Accordion - cached/static, order:4 (last) */}
						<div className="order-4 mt-6">
							<ProductAttributes
								descriptionHtml={descriptionHtml}
								attributes={productAttributes}
								careInstructions={careInstructions}
							/>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

// ============================================================================
// Helper Functions (pure - execute during prerender)
// ============================================================================

function parseDescription(description: string | null | undefined): string[] | null {
	if (!description) return null;

	try {
		const parsed = parser.parse(JSON.parse(description));
		return parsed.map((html: string) => xss(html));
	} catch {
		return [xss(`<p>${description}</p>`)];
	}
}

function extractProductAttributes(product: NonNullable<ProductDetailsQuery["product"]>) {
	const variantAttributeSlugs = ["size", "color", "colour", "variant"];
	const internalAttributeSlugs = ["care-instructions", "care"];

	return (product.attributes || [])
		.filter((attr) => attr.attribute.name)
		.filter((attr) => !variantAttributeSlugs.includes((attr.attribute.slug ?? "").toLowerCase()))
		.filter((attr) => !internalAttributeSlugs.includes((attr.attribute.slug ?? "").toLowerCase()))
		.map((attr) => ({
			name: attr.attribute.name!,
			value:
				attr.values.length === 1
					? attr.values[0]?.name ?? ""
					: attr.values.map((v) => v.name ?? "").filter(Boolean),
		}))
		.filter((attr) => {
			if (Array.isArray(attr.value)) return attr.value.length > 0;
			return attr.value !== "";
		});
}

function extractCareInstructions(product: NonNullable<ProductDetailsQuery["product"]>): string | null {
	const careAttr = (product.attributes || []).find(
		(attr) =>
			attr.attribute.slug === "care-instructions" ||
			attr.attribute.slug === "care" ||
			(attr.attribute.name ?? "").toLowerCase().includes("care"),
	);

	return (
		careAttr?.values
			.map((v) => v.name)
			.filter(Boolean)
			.join(". ") || null
	);
}

type Product = NonNullable<ProductDetailsQuery["product"]>;
type Variant = NonNullable<Product["variants"]>[number];

/**
 * Get gallery images for a product, with variant-specific image support.
 *
 * Priority:
 * 1. Selected variant's media (if variant selected and has images)
 * 2. Product media (filtered to images only)
 * 3. Product thumbnail as fallback
 */
function getGalleryImages(
	product: Product,
	selectedVariant: Variant | null | undefined,
): { url: string; alt: string | null | undefined }[] {
	// If variant is selected and has its own images, use those (filtered to images only)
	if (selectedVariant?.media && selectedVariant.media.length > 0) {
		const variantImages = selectedVariant.media
			.filter((m) => m.type === "IMAGE")
			.map((m) => ({ url: m.url, alt: m.alt }));
		if (variantImages.length > 0) {
			return variantImages;
		}
	}

	// Otherwise, use product-level images
	if (product.media && product.media.length > 0) {
		return product.media.filter((m) => m.type === "IMAGE").map((m) => ({ url: m.url, alt: m.alt }));
	}

	// Final fallback: thumbnail
	if (product.thumbnail) {
		return [{ url: product.thumbnail.url, alt: product.thumbnail.alt }];
	}

	return [];
}
