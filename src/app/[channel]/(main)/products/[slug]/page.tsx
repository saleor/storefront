import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { ErrorBoundary } from "react-error-boundary";
import edjsHTML from "editorjs-html";
import xss from "xss";

import Link from "next/link";
import { executePublicGraphQL } from "@/lib/graphql";
import {
	ProductDetailsDocument,
	ProductListByCategoryDocument,
	type ProductDetailsQuery,
} from "@/gql/graphql";
import { buildPageMetadata, buildProductJsonLd, buildFaqJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/ui/components/breadcrumbs";
import { transformToProductCard } from "@/ui/components/plp";
import { ProductCard } from "@/ui/components/plp/product-card";
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

async function getProductData(slug: string, channel: string) {
	"use cache";
	cacheLife("minutes");
	cacheTag(`product:${slug}`);

	const result = await executePublicGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(slug),
			channel,
		},
		revalidate: 300,
	});

	if (!result.ok) {
		console.error(`[getProductData] Failed to fetch product ${slug} for ${channel}:`, result.error.message);
		return null;
	}

	return result.data.product;
}

// ============================================================================
// Metadata
// ============================================================================

export async function generateMetadata(props: {
	params: Promise<{ slug: string; channel: string }>;
}): Promise<Metadata> {
	const params = await props.params;
	const product = await getProductData(params.slug, params.channel);

	if (!product) {
		return { title: "Product Not Found" };
	}

	const attributes = extractProductAttributes(product);
	const description = product.seoDescription || buildDescriptionFallback(product, attributes);
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

// NOTE: generateStaticParams is intentionally omitted for product pages.
// All product pages are generated on-demand via ISR instead.

// ============================================================================
// Page Component
// ============================================================================

const parser = edjsHTML();

/**
 * Sync page shell with dedicated Suspense boundary.
 * All cached product data + dynamic variant section stream inside
 * this boundary, not through the layout's main Suspense.
 */
export default function ProductPage(props: {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	return (
		<Suspense fallback={<ProductPageSkeleton />}>
			<ProductContent params={props.params} searchParams={props.searchParams} />
		</Suspense>
	);
}

async function ProductContent({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const [params, searchParams] = await Promise.all([paramsPromise, searchParamsPromise]);

	const product = await getProductData(params.slug, params.channel);

	if (!product) {
		notFound();
	}

	const variants = product.variants || [];
	const selectedVariantId = searchParams.variant || (variants.length === 1 ? variants[0].id : undefined);
	const selectedVariant = variants.find((v) => v.id === selectedVariantId);

	const descriptionHtml = parseDescription(product.description);
	const images = getGalleryImages(product, selectedVariant);
	const productAttributes = extractProductAttributes(product);
	const careInstructions = extractCareInstructions(product);
	const faqItems = extractFaqItems(product);
	const references = extractReferences(product);

	const breadcrumbs = [
		{ label: "Home", href: `/${params.channel}` },
		...(product.category
			? [{ label: product.category.name, href: `/${params.channel}/categories/${product.category.slug}` }]
			: []),
		{ label: product.name },
	];

	const productJsonLd = buildProductJsonLd({
		name: product.name,
		description: product.seoDescription || buildDescriptionFallback(product, productAttributes),
		images: images.length > 0 ? images.map((img) => img.url) : undefined,
		sku: selectedVariant?.sku ?? variants[0]?.sku,
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

	const faqJsonLd = faqItems ? buildFaqJsonLd(faqItems) : null;
	const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

	let relatedProducts: ReturnType<typeof transformToProductCard>[] = [];
	if (product.category) {
		const relResult = await executePublicGraphQL(ProductListByCategoryDocument, {
			variables: { slug: product.category.slug, channel: params.channel, first: 5 },
			revalidate: 300,
		});
		if (relResult.ok && relResult.data.category?.products) {
			relatedProducts = relResult.data.category.products.edges
				.map((e) => transformToProductCard(e.node, params.channel))
				.filter((p) => p.id !== product.id)
				.slice(0, 4);
		}
	}

	const lcpImageUrl = images[0]?.url;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{lcpImageUrl && <link rel="preload" as="image" href={lcpImageUrl} fetchPriority="high" />}

			{productJsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
				/>
			)}
			{faqJsonLd && (
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
			)}
			{breadcrumbJsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
				/>
			)}

			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
				<div className="mb-6 hidden sm:block">
					<Breadcrumbs items={breadcrumbs} />
				</div>

				<div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
					<div className="lg:sticky lg:top-24 lg:self-start">
						<ProductGallery images={images} productName={product.name} />
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
									searchParams={searchParamsPromise}
								/>
							</Suspense>
						</ErrorBoundary>

						<div className="order-4 mt-6">
							<ProductAttributes
								descriptionHtml={descriptionHtml}
								attributes={productAttributes}
								careInstructions={careInstructions}
								faqItems={faqItems}
								references={references}
							/>
						</div>
					</div>
				</div>
			</main>

			{relatedProducts.length > 0 && product.category && (
				<section className="border-t border-border bg-background" aria-label="Related products">
					<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
						<div className="mb-8 flex items-center justify-between">
							<h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Related Compounds</h2>
							<Link
								href={`/${params.channel}/categories/${product.category.slug}`}
								className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							>
								View all
							</Link>
						</div>
						<div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
							{relatedProducts.map((rp, i) => (
								<ProductCard key={rp.id} product={rp} priority={i < 2} />
							))}
						</div>
					</div>
				</section>
			)}
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
					<div className="aspect-square animate-pulse rounded-lg bg-secondary" />
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

function extractFaqItems(product: NonNullable<ProductDetailsQuery["product"]>) {
	const metadata = product.metadata || [];
	const metaMap = new Map(metadata.map((m) => [m.key, m.value]));
	const faqs: { question: string; answer: string }[] = [];

	for (let i = 1; i <= 5; i++) {
		const q = metaMap.get(`faq_${i}_q`);
		const a = metaMap.get(`faq_${i}_a`);
		if (q && a) {
			faqs.push({ question: q, answer: a });
		}
	}

	return faqs.length > 0 ? faqs : null;
}

function extractReferences(product: NonNullable<ProductDetailsQuery["product"]>) {
	const metadata = product.metadata || [];
	const metaMap = new Map(metadata.map((m) => [m.key, m.value]));
	const refs: string[] = [];

	for (let i = 1; i <= 3; i++) {
		const ref = metaMap.get(`ref_${i}`);
		if (ref) {
			refs.push(ref);
		}
	}

	return refs.length > 0 ? refs : null;
}

/**
 * Auto-compose a rich meta description from product attributes
 * when seoDescription is not set in the admin.
 */
function buildDescriptionFallback(
	product: NonNullable<ProductDetailsQuery["product"]>,
	attributes: { name: string; value: string | string[] }[],
): string {
	const parts: string[] = [product.name];

	if (product.category?.name) {
		parts.push(`by ${product.category.name}`);
	}

	const attrMap = new Map(
		attributes.map((a) => [a.name.toLowerCase(), Array.isArray(a.value) ? a.value.join(", ") : a.value]),
	);

	const purity = attrMap.get("purity");
	if (purity) parts.push(`${purity} purity`);

	const form = attrMap.get("form");
	if (form) parts.push(form.toLowerCase());

	const price = product.pricing?.priceRange?.start?.gross;
	if (price) {
		const formatted = new Intl.NumberFormat("en", {
			style: "currency",
			currency: price.currency,
		}).format(price.amount);
		parts.push(`from ${formatted}`);
	}

	parts.push("– COA included, free shipping over $150");

	return parts.join(" · ").slice(0, 160);
}

function getGalleryImages(
	product: Product,
	selectedVariant: Variant | null | undefined,
): { url: string; alt: string | null | undefined }[] {
	if (selectedVariant?.media && selectedVariant.media.length > 0) {
		const variantImages = selectedVariant.media
			.filter((m) => m.type === "IMAGE")
			.map((m) => ({ url: m.url, alt: m.alt }));
		if (variantImages.length > 0) {
			return variantImages;
		}
	}

	if (product.media && product.media.length > 0) {
		return product.media.filter((m) => m.type === "IMAGE").map((m) => ({ url: m.url, alt: m.alt }));
	}

	if (product.thumbnail) {
		return [{ url: product.thumbnail.url, alt: product.thumbnail.alt }];
	}

	return [];
}
