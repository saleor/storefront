import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ErrorBoundary } from "react-error-boundary";
import edjsHTML from "editorjs-html";
import xss from "xss";

import { executePublicGraphQL } from "@/lib/graphql";
import { ProductDetailsDocument, type ProductDetailsQuery } from "@/gql/graphql";
import { buildBrowsePageMetadata, buildProductJsonLd } from "@/lib/seo";
import { CACHE_PROFILES, applyCacheProfile } from "@/lib/cache-manifest";
import { graphqlLanguageCodeVariables } from "@/lib/graphql-locale";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { withTranslatedProductFields, pickTranslatedName } from "@/lib/saleor-translations";
import { getAttributeValueDisplayName } from "@/ui/components/pdp/variant-selection/utils";
import { Breadcrumbs } from "@/ui/components/breadcrumbs";
import {
	ProductAttributes,
	ProductGalleryFallback,
	VariantGalleryDynamic,
	GallerySkeleton,
	VariantSectionDynamic,
	VariantSectionSkeleton,
	VariantSectionError,
	getDefaultGalleryImages,
} from "@/ui/components/pdp";

// ============================================================================
// Cached Data Fetching
// ============================================================================

async function getProductData(slug: string, channel: string, localeSlug: string) {
	"use cache";
	applyCacheProfile(CACHE_PROFILES.products, slug);

	const result = await executePublicGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(slug),
			channel,
			...graphqlLanguageCodeVariables(localeSlug),
		},
	});

	if (!result.ok) {
		console.error(`[getProductData] Failed to fetch product ${slug} for ${channel}:`, result.error.message);
		return null;
	}

	return result.data.product ? withTranslatedProductFields(result.data.product) : null;
}

// ============================================================================
// Metadata
// ============================================================================

export async function generateMetadata(props: {
	params: Promise<{ locale: string; slug: string; channel: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const product = await getProductData(params.slug, params.channel, params.locale);

	if (!product) {
		return { title: "Product Not Found" };
	}

	const description = product.seoDescription || product.name;
	const ogImage = product.media?.[0]?.url || product.thumbnail?.url;
	const priceAmount = product.pricing?.priceRange?.start?.gross?.amount;
	const priceCurrency = product.pricing?.priceRange?.start?.gross?.currency;

	return buildBrowsePageMetadata({
		title: product.seoTitle || product.name,
		description,
		image: ogImage,
		locale: params.locale,
		channel: params.channel,
		pathSuffix: `/products/${encodeURIComponent(params.slug)}`,
		openGraph:
			priceAmount && priceCurrency
				? {
						"product:price:amount": String(priceAmount),
						"product:price:currency": priceCurrency,
					}
				: undefined,
	});
}

// NOTE: generateStaticParams is intentionally omitted for product pages.
// All product pages are generated on-demand via ISR instead.

// ============================================================================
// Page Component
// ============================================================================

const parser = edjsHTML();

/**
 * Sync page entry — Suspense while params resolve and cached product data loads.
 * searchParams is passed through without being awaited here or in the shell.
 */
export default function ProductPage(props: {
	params: Promise<{ locale: string; slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	return (
		<Suspense fallback={<ProductPageSkeleton />}>
			<ProductShell params={props.params} searchParams={props.searchParams} />
		</Suspense>
	);
}

/**
 * Static product shell — only reads route params (cacheable / prerenderable).
 * Dynamic islands (gallery + variant section) read searchParams in nested Suspense.
 */
async function ProductShell({
	params: paramsPromise,
	searchParams,
}: {
	params: Promise<{ locale: string; slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const params = await paramsPromise;
	const browse = (suffix: string) => buildStorefrontPath(params.locale, params.channel, suffix);
	const [product, tPdp, tNav] = await Promise.all([
		getProductData(params.slug, params.channel, params.locale),
		getTranslations({ locale: params.locale, namespace: "pdp" }),
		getTranslations({ locale: params.locale, namespace: "nav" }),
	]);

	if (!product) {
		notFound();
	}

	const descriptionHtml = parseDescription(product.description);
	const productAttributes = extractProductAttributes(product);
	const careInstructions = extractCareInstructions(product);
	const defaultImages = getDefaultGalleryImages(product);

	const breadcrumbs = [
		{ label: tPdp("breadcrumbHome"), href: browse("/") },
		...(product.category
			? [{ label: product.category.name, href: browse(`/categories/${product.category.slug}`) }]
			: []),
		{ label: product.name },
	];

	const productJsonLd = buildProductJsonLd({
		name: product.name,
		description: product.seoDescription || product.name,
		images: defaultImages.length > 0 ? defaultImages.map((img) => img.url) : undefined,
		brand: product.category?.name,
		url: browse(`/products/${product.slug}`),
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

	const lcpImage = defaultImages[0];
	// Reserve mobile dots / desktop thumbs in fallback when product has multiple images
	const showGalleryChrome = defaultImages.length > 1;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{productJsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
				/>
			)}

			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
				<div className="mb-6 hidden sm:block">
					<Breadcrumbs items={breadcrumbs} ariaLabel={tNav("breadcrumbAriaLabel")} />
				</div>

				<div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
					<div className="lg:sticky lg:top-24 lg:self-start">
						<Suspense
							fallback={
								lcpImage ? (
									<ProductGalleryFallback
										src={lcpImage.url}
										alt={lcpImage.alt ?? product.name}
										imageCount={defaultImages.length}
										showChrome={showGalleryChrome}
									/>
								) : null
							}
						>
							<VariantGalleryDynamic product={product} searchParams={searchParams} />
						</Suspense>
					</div>

					<div className="flex flex-col gap-3">
						<h1 className="order-2 text-balance text-3xl font-semibold tracking-tight lg:text-4xl">
							{product.name}
						</h1>

						<ErrorBoundary FallbackComponent={VariantSectionError}>
							<Suspense fallback={<VariantSectionSkeleton />}>
								<VariantSectionDynamic
									product={product}
									channel={params.channel}
									localeSlug={params.locale}
									searchParams={searchParams}
								/>
							</Suspense>
						</ErrorBoundary>

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
// Skeleton
// ============================================================================

function ProductPageSkeleton() {
	return (
		<div className="flex min-h-screen animate-skeleton-delayed flex-col bg-background opacity-0">
			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
				<div className="mb-6 hidden h-4 w-64 animate-pulse rounded bg-secondary sm:block" />
				<div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
					<GallerySkeleton />
					<div className="flex flex-col gap-4">
						<div className="h-8 w-3/4 animate-pulse rounded bg-secondary" />
						<div className="h-6 w-24 animate-pulse rounded bg-secondary" />
						<div className="mt-4 space-y-3">
							<div className="h-10 w-full animate-pulse rounded bg-secondary" />
							<div className="h-10 w-full animate-pulse rounded bg-secondary" />
						</div>
						<div className="mt-4 h-12 w-full animate-pulse rounded bg-secondary" />
					</div>
				</div>
			</main>
		</div>
	);
}

// ============================================================================
// Helper Functions
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
			name: pickTranslatedName({
				name: attr.attribute.name!,
				translation: attr.attribute.translation,
			}),
			value:
				attr.values.length === 1
					? getAttributeValueDisplayName(attr.values[0] ?? { name: "" })
					: attr.values.map((v) => getAttributeValueDisplayName(v)).filter(Boolean),
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
			.map((v) => getAttributeValueDisplayName(v))
			.filter(Boolean)
			.join(". ") || null
	);
}
