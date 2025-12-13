import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import { invariant } from "ts-invariant";
import { type WithContext, type Product } from "schema-dts";
import { AddButton } from "@/ui/components/AddToCart";
import { VariantSelector } from "@/ui/components/VariantSelector";
import { ProductGallery } from "@/ui/components/ProductGallery";
import { ProductTabs } from "@/ui/components/ProductTabs";
import { RelatedProducts } from "@/ui/components/RelatedProducts";
import { Breadcrumb } from "@/ui/components/Breadcrumb";
import { AvailabilityMessage } from "@/ui/components/AvailabilityMessage";
import { executeGraphQL } from "@/lib/graphql";
import { formatMoney, formatMoneyRange } from "@/lib/utils";
import {
	CheckoutAddLineDocument,
	ProductDetailsDocument,
	ProductListDocument,
	ProductListByCategoryDocument,
	PageGetBySlugDocument,
} from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";
import { Share2, Heart } from "lucide-react";
import { ProductPageTrustBadges } from "@/ui/components/ProductPageTrustBadges";
import { getStorePolicies } from "@/lib/content";

export async function generateMetadata(
	props: {
		params: Promise<{ slug: string; channel: string }>;
		searchParams: Promise<{ variant?: string }>;
	},
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);

	const { product } = await executeGraphQL(ProductDetailsDocument, {
		variables: {
			slug: decodeURIComponent(params.slug),
			channel: params.channel,
		},
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}

	const productName = product.seoTitle || product.name;
	const variantName = product.variants?.find(({ id }) => id === searchParams.variant)?.name;
	const productNameAndVariant = variantName ? `${productName} - ${variantName}` : productName;

	return {
		title: `${product.name} | Luxior Mall`,
		description: product.seoDescription || productNameAndVariant,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
				? process.env.NEXT_PUBLIC_STOREFRONT_URL + `/products/${encodeURIComponent(params.slug)}`
				: undefined,
		},
		openGraph: product.thumbnail
			? {
					images: [{ url: product.thumbnail.url, alt: product.name }],
				}
			: null,
	};
}

export async function generateStaticParams({ params }: { params: { channel: string } }) {
	const { products } = await executeGraphQL(ProductListDocument, {
		revalidate: 60,
		variables: { first: 20, channel: params.channel },
		withAuth: false,
	});

	return products?.edges.map(({ node: { slug } }) => ({ slug })) || [];
}

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
		revalidate: 60,
	});

	if (!product) {
		notFound();
	}

	// Fetch related products from same category
	let relatedProducts = null;
	if (product.category?.slug) {
		const { category } = await executeGraphQL(ProductListByCategoryDocument, {
			variables: { slug: product.category.slug, channel: params.channel },
			revalidate: 60,
		});
		relatedProducts = category?.products?.edges
			.map((e) => e.node)
			.filter((p) => p.id !== product.id)
			.slice(0, 4);
	}

	// Fetch shipping and returns pages content from Saleor
	const [shippingPage, returnsPage, storePolicies] = await Promise.all([
		executeGraphQL(PageGetBySlugDocument, {
			variables: { slug: "shipping" },
			revalidate: 60 * 60 * 24, // Cache for 24 hours
		}).catch(() => ({ page: null })),
		executeGraphQL(PageGetBySlugDocument, {
			variables: { slug: "returns" },
			revalidate: 60 * 60 * 24,
		}).catch(() => ({ page: null })),
		getStorePolicies(),
	]);

	const shippingReturnsContent = {
		shippingTitle: shippingPage.page?.title || undefined,
		// Use page content if available, otherwise use policy content from getStorePolicies
		shippingContent: shippingPage.page?.content || storePolicies.shippingContent || undefined,
		returnsTitle: returnsPage.page?.title || undefined,
		returnsContent: returnsPage.page?.content || storePolicies.returnsContent || undefined,
		freeShippingThreshold: storePolicies.freeShippingThreshold,
		returnPeriodDays: storePolicies.returnPeriodDays,
	};

	// Prepare images for gallery
	const galleryImages = product.media?.length
		? product.media.filter((m) => m.type === "IMAGE").map((m) => ({ url: m.url, alt: m.alt }))
		: product.thumbnail
			? [{ url: product.thumbnail.url, alt: product.thumbnail.alt }]
			: [];

	const variants = product.variants;

	// Auto-select variant if only one exists or if none selected
	let selectedVariantID = searchParams.variant;
	if (!selectedVariantID && variants?.length === 1) {
		selectedVariantID = variants[0].id;
	}

	const selectedVariant = variants?.find(({ id }) => id === selectedVariantID);

	async function addItem() {
		"use server";

		const checkout = await Checkout.findOrCreate({
			checkoutId: await Checkout.getIdFromCookies(params.channel),
			channel: params.channel,
		});
		invariant(checkout, "This should never happen");

		await Checkout.saveIdToCookie(params.channel, checkout.id);

		if (!selectedVariantID) {
			return;
		}

		await executeGraphQL(CheckoutAddLineDocument, {
			variables: {
				id: checkout.id,
				productVariantId: decodeURIComponent(selectedVariantID),
			},
			cache: "no-cache",
		});

		revalidatePath("/cart");
	}

	const isAvailable = variants?.some((variant) => variant.quantityAvailable) ?? false;

	// Check if product is on sale
	const isOnSale = selectedVariant?.pricing?.onSale || product?.pricing?.onSale;

	// Get current price
	const currentPrice = selectedVariant?.pricing?.price?.gross
		? formatMoney(selectedVariant.pricing.price.gross.amount, selectedVariant.pricing.price.gross.currency)
		: isAvailable
			? formatMoneyRange({
					start: product?.pricing?.priceRange?.start?.gross,
					stop: product?.pricing?.priceRange?.stop?.gross,
				})
			: "";

	// Get original price (before discount)
	const originalPrice = selectedVariant?.pricing?.priceUndiscounted?.gross
		? formatMoney(
				selectedVariant.pricing.priceUndiscounted.gross.amount,
				selectedVariant.pricing.priceUndiscounted.gross.currency,
			)
		: product?.pricing?.priceRangeUndiscounted?.start?.gross
			? formatMoneyRange({
					start: product?.pricing?.priceRangeUndiscounted?.start?.gross,
					stop: product?.pricing?.priceRangeUndiscounted?.stop?.gross,
				})
			: null;

	// Calculate discount percentage
	const discountPercentage =
		selectedVariant?.pricing?.price?.gross && selectedVariant?.pricing?.priceUndiscounted?.gross
			? Math.round(
					(1 -
						selectedVariant.pricing.price.gross.amount /
							selectedVariant.pricing.priceUndiscounted.gross.amount) *
						100,
				)
			: product?.pricing?.discount?.gross && product?.pricing?.priceRangeUndiscounted?.start?.gross
				? Math.round(
						(product.pricing.discount.gross.amount /
							product.pricing.priceRangeUndiscounted.start.gross.amount) *
							100,
					)
				: 0;

	const price = currentPrice;

	// Prepare attributes for tabs
	const productAttributes =
		product.attributes
			?.map((attr) => ({
				name: attr.attribute.name || "",
				value: attr.values.map((v) => v.name).join(", "),
			}))
			.filter((a) => a.name && a.value) || [];

	// JSON-LD structured data
	const productJsonLd: WithContext<Product> = {
		"@context": "https://schema.org",
		"@type": "Product",
		image: product.thumbnail?.url,
		...(selectedVariant
			? {
					name: `${product.name} - ${selectedVariant.name}`,
					description: product.seoDescription || `${product.name} - ${selectedVariant.name}`,
					offers: {
						"@type": "Offer",
						availability: selectedVariant.quantityAvailable
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
						priceCurrency: selectedVariant.pricing?.price?.gross.currency,
						price: selectedVariant.pricing?.price?.gross.amount,
					},
				}
			: {
					name: product.name,
					description: product.seoDescription || product.name,
					offers: {
						"@type": "AggregateOffer",
						availability: product.variants?.some((variant) => variant.quantityAvailable)
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
						priceCurrency: product.pricing?.priceRange?.start?.gross.currency,
						lowPrice: product.pricing?.priceRange?.start?.gross.amount,
						highPrice: product.pricing?.priceRange?.stop?.gross.amount,
					},
				}),
	};

	return (
		<section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
			/>

			{/* Breadcrumb */}
			<Breadcrumb
				items={[
					{ label: "Products", href: "/products" },
					...(product.category
						? [{ label: product.category.name, href: `/categories/${product.category.slug}` }]
						: []),
					{ label: product.name },
				]}
				className="mb-6"
			/>

			{/* Product Main Section */}
			<form action={addItem}>
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
					{/* Product Gallery */}
					<div className="relative">
						{isOnSale && (
							<div className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
								Sale
							</div>
						)}
						<ProductGallery images={galleryImages} productName={product.name} enableZoom={true} />
					</div>

					{/* Product Info */}
					<div className="flex flex-col">
						{/* Category */}
						{product.category && (
							<p className="mb-2 text-sm font-medium text-primary-600">{product.category.name}</p>
						)}

						{/* Title */}
						<h1 className="mb-4 text-2xl font-bold text-secondary-900 sm:text-3xl">{product.name}</h1>

						{/* SKU */}
						{selectedVariant?.sku && (
							<p className="mb-2 text-sm text-secondary-500">SKU: {selectedVariant.sku}</p>
						)}

						{/* Price */}
						<div className="mb-6" data-testid="ProductElement_Price">
							{isOnSale && originalPrice ? (
								<div className="flex items-center gap-3">
									<span className="text-2xl font-bold text-red-600">{price}</span>
									<span className="text-lg text-secondary-400 line-through">{originalPrice}</span>
									{discountPercentage > 0 && (
										<span className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
											-{discountPercentage}%
										</span>
									)}
								</div>
							) : (
								<span className="text-2xl font-bold text-secondary-900">{price}</span>
							)}
						</div>

						{/* Variant Selector */}
						{variants && variants.length > 0 && (
							<div className="mb-6">
								<VariantSelector
									selectedVariant={selectedVariant}
									variants={variants}
									product={product}
									channel={params.channel}
								/>
							</div>
						)}

						{/* Availability */}
						<div className="mb-6">
							<AvailabilityMessage
								isAvailable={isAvailable}
								quantityAvailable={selectedVariant?.quantityAvailable}
							/>
						</div>

						{/* Add to Cart */}
						<div className="mb-8">
							<AddButton disabled={!selectedVariantID || !selectedVariant?.quantityAvailable} />
						</div>

						{/* Quick Actions */}
						<div className="mb-8 flex gap-4">
							<button
								type="button"
								className="flex items-center gap-2 text-sm text-secondary-600 transition-colors hover:text-primary-600"
							>
								<Heart className="h-5 w-5" />
								Add to Wishlist
							</button>
							<button
								type="button"
								className="flex items-center gap-2 text-sm text-secondary-600 transition-colors hover:text-primary-600"
							>
								<Share2 className="h-5 w-5" />
								Share
							</button>
						</div>

						{/* Trust Badges */}
						<ProductPageTrustBadges />
					</div>
				</div>
			</form>

			{/* Product Tabs */}
			<ProductTabs
				description={product.description}
				attributes={productAttributes}
				shippingReturns={shippingReturnsContent}
			/>

			{/* Related Products */}
			{relatedProducts && relatedProducts.length > 0 && (
				<RelatedProducts
					products={relatedProducts}
					title="You May Also Like"
					categorySlug={product.category?.slug}
				/>
			)}
		</section>
	);
}
