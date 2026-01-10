import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { invariant } from "ts-invariant";
import edjsHTML from "editorjs-html";
import xss from "xss";

import { executeGraphQL } from "@/lib/graphql";
import { formatMoney, formatMoneyRange } from "@/lib/utils";
import { CheckoutAddLineDocument, ProductDetailsDocument, ProductListDocument } from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";
import { buildPageMetadata, buildProductJsonLd } from "@/lib/seo";

// Route segment config for optimal caching
export const dynamicParams = true; // Allow dynamic params not in generateStaticParams
export const revalidate = 300; // Default revalidation: 5 minutes

import { Breadcrumbs } from "@/ui/components/Breadcrumbs";
import {
	ProductGallery,
	AddToCart,
	ProductAttributes,
	StickyBar,
	VariantSelectionSection,
} from "@/ui/components/pdp";
import { Badge } from "@/ui/components/ui/Badge";

/**
 * Product page metadata generation
 * Uses centralized SEO helpers from @/lib/seo
 */
export async function generateMetadata(props: {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}): Promise<Metadata> {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel,
		},
		revalidate: 300,
	});

	if (!product) {
		notFound();
	}

	// Build description with variant name if selected
	const variantName = product.variants?.find(({ id }) => id === searchParams.variant)?.name;
	const description =
		product.seoDescription || (variantName ? `${product.name} - ${variantName}` : product.name);

	// Best image for sharing
	const ogImage = product.media?.[0]?.url || product.thumbnail?.url;

	// Price info for OG tags
	const priceAmount = product.pricing?.priceRange?.start?.gross?.amount;
	const priceCurrency = product.pricing?.priceRange?.start?.gross?.currency;

	return buildPageMetadata({
		title: product.seoTitle || product.name,
		description,
		image: ogImage,
		url: `/${params.channel}/products/${encodeURIComponent(params.slug)}`,
		// Product pricing for rich previews
		openGraph:
			priceAmount && priceCurrency
				? {
						"product:price:amount": String(priceAmount),
						"product:price:currency": priceCurrency,
					}
				: undefined,
	});
}

// Static params generation
export async function generateStaticParams({ params }: { params: { channel: string } }) {
	const { products } = await executeGraphQL(ProductListDocument, {
		revalidate: 300, // 5 minutes - balance freshness vs performance
		variables: { first: 20, channel: params.channel },
		withAuth: false,
	});

	return products?.edges.map(({ node: { slug } }) => ({ slug })) || [];
}

const parser = edjsHTML();

export default async function ProductPage(props: {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel,
		},
		revalidate: 300, // 5 minutes - balance freshness vs performance
	});

	if (!product) {
		notFound();
	}

	// Parse data
	const variants = product.variants || [];

	// Auto-select variant: use URL param, or auto-select if only one variant exists
	const selectedVariantID = searchParams.variant || (variants.length === 1 ? variants[0].id : undefined);
	const selectedVariant = variants.find(({ id }) => id === selectedVariantID);

	// Parse description from EditorJS format and sanitize HTML
	let descriptionHtml: string[] | null = null;
	try {
		if (product.description) {
			const parsed = parser.parse(JSON.parse(product.description));
			descriptionHtml = parsed.map((html: string) => xss(html));
		}
	} catch {
		// If parsing fails, wrap plain text in a paragraph
		if (product.description) {
			descriptionHtml = [xss(`<p>${product.description}</p>`)];
		}
	}

	// Check availability
	const isAvailable = variants.some((variant) => variant.quantityAvailable);

	function getAddToCartState() {
		if (!selectedVariantID) {
			return { disabled: true, reason: "no-selection" as const };
		}
		if (!selectedVariant?.quantityAvailable) {
			return { disabled: true, reason: "out-of-stock" as const };
		}
		return { disabled: false, reason: undefined };
	}

	const { disabled: isAddToCartDisabled, reason: disabledReason } = getAddToCartState();

	// Format prices
	const price = selectedVariant?.pricing?.price?.gross
		? formatMoney(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)
		: formatMoneyRange({
				start: product.pricing?.priceRange?.start?.gross,
				stop: product.pricing?.priceRange?.stop?.gross,
			}) || "";

	// Prepare images from product media
	const images =
		product.media && product.media.length > 0
			? product.media.filter((m) => m.type === "IMAGE").map((m) => ({ url: m.url, alt: m.alt }))
			: product.thumbnail
				? [{ url: product.thumbnail.url, alt: product.thumbnail.alt }]
				: [];

	// Extract product attributes for display
	// Filter out variant-specific attributes (Size, Color) as they're handled by variant selector
	const variantAttributeSlugs = ["size", "color", "colour", "variant"];
	const internalAttributeSlugs = ["care-instructions", "care"];

	const productAttributes = (product.attributes || [])
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

	// Look for care instructions attribute
	const careAttr = (product.attributes || []).find(
		(attr) =>
			attr.attribute.slug === "care-instructions" ||
			attr.attribute.slug === "care" ||
			(attr.attribute.name ?? "").toLowerCase().includes("care"),
	);
	const careInstructions =
		careAttr?.values
			.map((v) => v.name)
			.filter(Boolean)
			.join(". ") || null;

	// Server action for adding to cart
	async function addToCart() {
		"use server";

		if (!selectedVariantID) return;

		const checkout = await Checkout.findOrCreate({
			checkoutId: await Checkout.getIdFromCookies(params.channel),
			channel: params.channel,
		});
		invariant(checkout, "Failed to create checkout");

		await Checkout.saveIdToCookie(params.channel, checkout.id);

		await executeGraphQL(CheckoutAddLineDocument, {
			variables: {
				id: checkout.id,
				productVariantId: decodeURIComponent(selectedVariantID),
			},
			cache: "no-cache",
		});

		revalidatePath("/cart");
	}

	// JSON-LD structured data for rich Google results
	// Uses centralized builder from @/lib/seo
	const productJsonLd = buildProductJsonLd({
		name: product.name,
		description: product.seoDescription || product.name,
		images: images.length > 0 ? images.map((img) => img.url) : undefined,
		sku: selectedVariant?.sku,
		brand: product.category?.name,
		url: `/${params.channel}/products/${product.slug}`,
		price: selectedVariant?.pricing?.price?.gross
			? {
					amount: selectedVariant.pricing.price.gross.amount,
					currency: selectedVariant.pricing.price.gross.currency,
				}
			: null,
		priceRange:
			!selectedVariant && product.pricing?.priceRange?.start?.gross
				? {
						lowPrice: product.pricing.priceRange.start.gross.amount,
						highPrice:
							product.pricing.priceRange.stop?.gross?.amount || product.pricing.priceRange.start.gross.amount,
						currency: product.pricing.priceRange.start.gross.currency,
					}
				: null,
		inStock: selectedVariant ? !!selectedVariant.quantityAvailable : isAvailable,
		variantCount: variants.length,
	});

	// Breadcrumbs
	const breadcrumbs = [
		{ label: "Home", href: "/" },
		...(product.category
			? [{ label: product.category.name, href: `/categories/${product.category.slug}` }]
			: []),
		{ label: product.name },
	];

	return (
		<div className="flex min-h-screen flex-col bg-background">
			{/* JSON-LD for rich Google results - can be disabled in seo/config.ts */}
			{productJsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
				/>
			)}

			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
				{/* Breadcrumb - hidden on mobile */}
				<div className="mb-6 hidden sm:block">
					<Breadcrumbs items={breadcrumbs} />
				</div>

				{/* Product Grid */}
				<form action={addToCart}>
					<div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
						{/* Left Column - Gallery */}
						<div className="lg:sticky lg:top-24 lg:self-start">
							<ProductGallery images={images} productName={product.name} />
						</div>

						{/* Right Column - Product Info */}
						<div className="space-y-8">
							{/* Header */}
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									{product.category && (
										<span className="text-sm text-muted-foreground">{product.category.name}</span>
									)}
									{!isAvailable && (
										<Badge variant="secondary" className="text-xs">
											Out of stock
										</Badge>
									)}
								</div>
								<h1 className="text-balance text-3xl font-semibold tracking-tight lg:text-4xl">
									{product.name}
								</h1>
							</div>

							{/* Variant Selectors */}
							<VariantSelectionSection
								variants={variants}
								selectedVariantId={selectedVariantID}
								productSlug={product.slug}
								channel={params.channel}
							/>

							{/* Add to Cart */}
							<AddToCart price={price} disabled={isAddToCartDisabled} disabledReason={disabledReason} />

							{/* Product Details Accordion */}
							<ProductAttributes
								descriptionHtml={descriptionHtml}
								attributes={productAttributes}
								careInstructions={careInstructions}
							/>
						</div>
					</div>

					{/* Sticky Add to Cart Bar (Mobile) */}
					<StickyBar productName={product.name} price={price} show={!isAddToCartDisabled} />
				</form>
			</main>
		</div>
	);
}
