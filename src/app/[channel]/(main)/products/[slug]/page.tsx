import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { ErrorBoundary } from "react-error-boundary";
import edjsHTML from "editorjs-html";
import xss from "xss";

import { executePublicGraphQL } from "@/lib/graphql";
import { ProductDetailsDocument, type ProductDetailsQuery } from "@/gql/graphql";
import { buildPageMetadata, buildProductJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/ui/components/breadcrumbs";
import {
	ProductGallery,
	ProductAttributes,
	VariantSectionDynamic,
	VariantSectionSkeleton,
	VariantSectionError,
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

	const result = await executePublicGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(slug),
			channel,
		},
		revalidate: 300,
	});

	if (!result.ok) {
		// During build, if the API is unreachable, return null instead of failing.
		// The page will be populated on-demand when a user visits.
		console.error(`[getProductData] Failed to fetch product ${slug} for ${channel}:`, result.error.message);
		return null;
	}

	return result.data.product;
}

// ============================================================================
// Metadata & Static Params
// ============================================================================

export async function generateMetadata(props: {
	params: Promise<{ slug: string; channel: string }>;
}): Promise<Metadata> {
	// Avoid searchParams here - it makes the page dynamic and can cause build issues
	const params = await props.params;
	const product = await getProductData(params.slug, params.channel);

	if (!product) {
		return { title: "Product Not Found" };
	}

	const description = product.seoDescription || product.name;
	const ogImage = product.media?.[0]?.url || product.thumbnail?.url;
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

/**
 * Static params for product pages.
 *
 * Control via STATIC_PRODUCT_COUNT env var:
 * - Not set or 0: Fetch 1 product (minimum for Cache Components)
 * - N > 0: Fetch N products to pre-render
 *
 * All other product pages are generated on-demand via ISR.
 */
// NOTE: generateStaticParams is intentionally omitted for product pages.
//
// With Next.js 16 Cache Components, using generateStaticParams on this route
// causes build timeouts (60s+) due to how params/searchParams Promises are
// resolved during static generation.
//
// All product pages are generated on-demand via ISR instead. This is actually
// beneficial because:
// 1. Faster builds (no product API calls during build)
// 2. Cache Components still cache data after first visit
// 3. No stale product data from build time

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

	// Find selected variant from URL params
	const variants = product.variants || [];
	const selectedVariantId = searchParams.variant || (variants.length === 1 ? variants[0].id : undefined);
	const selectedVariant = variants.find((v) => v.id === selectedVariantId);

	// Parse description (cached - part of static shell)
	const descriptionHtml = parseDescription(product.description);

	// Get images - uses variant images if variant is selected, otherwise product images
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
						<ProductGallery images={images} productName={product.name} />
					</div>

					{/* Right Column - Product Info */}
					<div className="flex flex-col gap-3">
						{/* Product Name - static shell for SEO/LCP, order:2 so Category appears above */}
						<h1 className="order-2 text-balance text-3xl font-semibold tracking-tight lg:text-4xl">
							{product.name}
						</h1>

						{/* Variant Section - DYNAMIC (streams at request time), order:1 for Category row, order:3 for rest */}
						<ErrorBoundary FallbackComponent={VariantSectionError}>
							<Suspense fallback={<VariantSectionSkeleton />}>
								<VariantSectionDynamic
									product={product}
									channel={params.channel}
									searchParams={props.searchParams}
								/>
							</Suspense>
						</ErrorBoundary>

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
