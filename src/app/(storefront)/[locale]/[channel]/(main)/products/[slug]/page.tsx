import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ErrorBoundary } from "react-error-boundary";
import edjsHTML from "editorjs-html";
import xss from "xss";

import { type ProductDetailsQuery } from "@/gql/graphql";
import { resolveLocaleFromSlug } from "@/config/locale";
import { resolveChannelCurrency } from "@/lib/channels/resolve-channel-currency";
import { catalogPathSuffix, redirectToCanonicalCatalogSlug } from "@/lib/catalog/canonical-slug";
import { CatalogIdentityBridge } from "@/lib/catalog/catalog-identity-bridge";
import { getProductData } from "@/lib/catalog/get-product-data";
import { buildCatalogPathSuffixByLocale, buildLocaleSlugMap } from "@/lib/catalog/locale-slugs";
import { buildPolicyLabelValues } from "@/lib/content";
import { getStorefrontContent } from "@/lib/content/server";
import { buildBrowsePageMetadata, buildProductJsonLd, jsonLdScriptProps } from "@/lib/seo";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { pickTranslatedName, pickTranslatedSlug } from "@/lib/saleor-translations";
import { isBestseller, BESTSELLER_ATTRIBUTE_SLUGS } from "@/lib/catalog/product-flags";
import { Breadcrumbs } from "@/ui/components/breadcrumbs";
import { BestsellerBadge } from "@/ui/components/ui/sale-label";
import {
	ProductAttributes,
	activeGalleryVariant,
	VariantGalleryDynamic,
	ProductRouteSkeleton,
	VariantSectionDynamic,
	VariantSectionSkeleton,
	VariantSectionError,
	getDefaultGalleryImages,
	PDP_GALLERY_LAYOUT,
	PDP_LAYOUT_CLASSES,
	type Product,
} from "@/ui/components/pdp";

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
		pathSuffix: catalogPathSuffix("products", product),
		pathSuffixByLocale: buildCatalogPathSuffixByLocale("products", buildLocaleSlugMap(product)),
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
	searchParams: Promise<{ variant?: string; sku?: string }>;
}) {
	return (
		<Suspense fallback={<ProductRouteSkeleton surface="page" />}>
			<ProductShell params={props.params} searchParams={props.searchParams} />
		</Suspense>
	);
}

/**
 * Product shell — reads route params for the static/PPR path.
 * Awaits searchParams only when issuing a canonical-slug redirect (rare).
 * Dynamic islands (gallery + variant section) read searchParams and fetch variants
 * in nested Suspense — variant payloads never enter this shell's RSC tree.
 */
async function ProductShell({
	params: paramsPromise,
	searchParams,
}: {
	params: Promise<{ locale: string; slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string; sku?: string }>;
}) {
	const params = await paramsPromise;
	const browse = (suffix: string) => buildStorefrontPath(params.locale, params.channel, suffix);
	const [product, tPdp, tNav, content, currency] = await Promise.all([
		getProductData(params.slug, params.channel, params.locale),
		getTranslations({ locale: params.locale, namespace: "pdp" }),
		getTranslations({ locale: params.locale, namespace: "nav" }),
		getStorefrontContent(params.channel, params.locale),
		resolveChannelCurrency(params.channel),
	]);
	const policyLabels = buildPolicyLabelValues(content.policies, {
		currency,
		locale: resolveLocaleFromSlug(params.locale).bcp47,
	});

	if (!product) {
		notFound();
	}

	// Only await searchParams on the rare non-canonical slug path so the common
	// (already-canonical) PDP shell stays params-only / PPR-static.
	if (decodeURIComponent(params.slug) !== pickTranslatedSlug(product)) {
		redirectToCanonicalCatalogSlug({
			locale: params.locale,
			channel: params.channel,
			urlSlug: params.slug,
			kind: "products",
			entity: product,
			searchParams: await searchParams,
		});
	}

	const descriptionHtml = parseDescription(product.description);
	const productAttributes = extractProductAttributes(product);
	const careInstructions = extractCareInstructions(product);
	const defaultImages = getDefaultGalleryImages(product);
	const productPath = catalogPathSuffix("products", product);

	const breadcrumbs = [
		{ label: tPdp("breadcrumbHome"), href: browse("/") },
		...(product.category
			? [
					{
						label: product.category.name,
						href: browse(catalogPathSuffix("categories", product.category)),
					},
				]
			: []),
		{ label: product.name },
	];

	const productJsonLd = buildProductJsonLd({
		name: product.name,
		description: product.seoDescription || product.name,
		images: defaultImages.length > 0 ? defaultImages.map((img) => img.url) : undefined,
		brand: product.category?.name,
		url: browse(productPath),
		priceRange: product.pricing?.priceRange?.start?.gross
			? {
					lowPrice: product.pricing.priceRange.start.gross.amount,
					highPrice:
						product.pricing.priceRange.stop?.gross?.amount || product.pricing.priceRange.start.gross.amount,
					currency: product.pricing.priceRange.start.gross.currency,
				}
			: null,
		inStock: product.isAvailable ?? false,
		variantCount: product.productVariants?.totalCount ?? 0,
	});

	const lcpImage = defaultImages[0];
	// Reserve mobile dots / desktop thumbs in fallback when product has multiple images
	const showGalleryChrome = defaultImages.length > 1;
	const showBestsellerBadge = isBestseller(product);
	const layout = PDP_LAYOUT_CLASSES[PDP_GALLERY_LAYOUT];
	const { Fallback: GalleryFallback } = activeGalleryVariant();
	const galleryFallback = lcpImage ? (
		<GalleryFallback
			src={lcpImage.url}
			alt={lcpImage.alt ?? product.name}
			imageCount={defaultImages.length}
			showChrome={showGalleryChrome}
		/>
	) : null;

	const productAttributesNode = (
		<ProductAttributes
			descriptionHtml={descriptionHtml}
			attributes={productAttributes}
			careInstructions={careInstructions}
			policyLabels={policyLabels}
		/>
	);

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<CatalogIdentityBridge
				kind="products"
				primarySlug={product.slug}
				localeSlugs={buildLocaleSlugMap(product)}
			/>
			{productJsonLd && <script {...jsonLdScriptProps(productJsonLd)} />}

			{/* The browse layout (`(main)/layout.tsx`) owns the page's single <main> landmark. */}
			<div className={layout.main}>
				<div className="mb-6 hidden sm:block">
					<Breadcrumbs items={breadcrumbs} ariaLabel={tNav("breadcrumbAriaLabel")} />
				</div>

				<div className={layout.grid}>
					<div className={layout.galleryColumn}>
						<Suspense fallback={galleryFallback}>
							<VariantGalleryDynamic
								product={product}
								channel={params.channel}
								localeSlug={params.locale}
								searchParams={searchParams}
							/>
						</Suspense>
					</div>

					<div className={layout.infoColumn}>
						{showBestsellerBadge && (
							<div className="order-1 flex items-center gap-2">
								<BestsellerBadge />
							</div>
						)}

						<h1 className="order-2 text-balance text-h1">{product.name}</h1>

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

						{layout.attributesPlacement === "info" && (
							<div className="order-4 mt-6">{productAttributesNode}</div>
						)}
					</div>

					{layout.attributesPlacement === "gallery" && layout.attributesGalleryBlock && (
						<div className={layout.attributesGalleryBlock}>{productAttributesNode}</div>
					)}
				</div>
			</div>
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

type AssignedAttribute = NonNullable<
	NonNullable<ProductDetailsQuery["product"]>["assignedAttributes"]
>[number];

function extractProductAttributes(product: ProductShellForAttrs) {
	const variantAttributeSlugs = ["size", "color", "colour", "variant"];
	const internalAttributeSlugs = ["care-instructions", "care", ...BESTSELLER_ATTRIBUTE_SLUGS];

	return (product.assignedAttributes || [])
		.filter((attr) => attr.attribute.name)
		.filter((attr) => !variantAttributeSlugs.includes((attr.attribute.slug ?? "").toLowerCase()))
		.filter((attr) => !internalAttributeSlugs.includes((attr.attribute.slug ?? "").toLowerCase()))
		.map((attr) => {
			const name = pickTranslatedName({
				name: attr.attribute.name!,
				translation: attr.attribute.translation,
			});
			const value = assignedAttributeDisplayValue(attr);
			return { name, value };
		})
		.filter((attr): attr is { name: string; value: string | boolean | string[] } => {
			if (attr.value === null || attr.value === undefined) return false;
			if (Array.isArray(attr.value)) return attr.value.length > 0;
			if (typeof attr.value === "boolean") return true;
			return attr.value !== "";
		});
}

function extractCareInstructions(product: ProductShellForAttrs): string | null {
	const careAttr = (product.assignedAttributes || []).find(
		(attr) =>
			attr.attribute.slug === "care-instructions" ||
			attr.attribute.slug === "care" ||
			(attr.attribute.name ?? "").toLowerCase().includes("care"),
	);

	if (!careAttr) return null;
	const value = assignedAttributeDisplayValue(careAttr);
	if (value === null || value === undefined) return null;
	if (Array.isArray(value)) return value.filter(Boolean).join(". ") || null;
	if (typeof value === "boolean") return null;
	return value || null;
}

function assignedAttributeDisplayValue(attr: AssignedAttribute): string | string[] | boolean | null {
	if ("plainText" in attr && (attr.plainText != null || attr.plainTextTranslation != null)) {
		return (attr.plainTextTranslation || attr.plainText || "").trim() || null;
	}
	if ("boolean" in attr && typeof attr.boolean === "boolean") {
		return attr.boolean;
	}
	if ("numeric" in attr && attr.numeric != null) {
		return String(attr.numeric);
	}
	if ("choice" in attr && attr.choice) {
		return attr.choice.translation?.trim() || attr.choice.name?.trim() || null;
	}
	if ("choices" in attr && Array.isArray(attr.choices)) {
		return attr.choices.map((c) => c.translation?.trim() || c.name?.trim() || "").filter(Boolean);
	}
	return null;
}

type ProductShellForAttrs = Pick<Product, "assignedAttributes">;
