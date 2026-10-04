import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ErrorBoundary } from "react-error-boundary";

import { resolveLocaleFromSlug } from "@/config/locale";
import { templates } from "@/config/templates";
import { resolveChannelCurrency } from "@/lib/channels/resolve-channel-currency";
import { catalogPathSuffix, redirectToCanonicalCatalogSlug } from "@/lib/catalog/canonical-slug";
import { CatalogIdentityBridge } from "@/lib/catalog/catalog-identity-bridge";
import { getProductData } from "@/lib/catalog/get-product-data";
import { buildCatalogPathSuffixByLocale, buildLocaleSlugMap } from "@/lib/catalog/locale-slugs";
import { buildPolicyLabelValues } from "@/lib/content";
import { getStorefrontContent } from "@/lib/content/server";
import {
	buildBrowsePageMetadata,
	buildProductJsonLd,
	jsonLdScriptProps,
	resolveSeoDescription,
} from "@/lib/seo";
import { toProductView } from "@/lib/storefront/mappers/product";
import { buildStorefrontPath } from "@/lib/storefront-path";
import { pickTranslatedSlug } from "@/lib/saleor-translations";
import { Breadcrumbs } from "@/ui/components/breadcrumbs";
import {
	ProductAttributes,
	activeGalleryVariant,
	VariantGalleryDynamic,
	VariantSectionDynamic,
	VariantSectionFallback,
	variantSectionFallbackProps,
	VariantSectionError,
	getDefaultGalleryImages,
} from "@/ui/components/pdp";

// Prefetch: default (auto). With global `partialPrefetching`, product-card links prefetch only
// the App Shell. Do not use `prefetch={true}` on PLP cards — a per-link runtime prefetch would
// wake the server for every visible card and stall slow-network clicks until it responds.

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

	// Translated description (Editor.js → plain text) so meta/OG never collapse to the
	// bare product name when the merchant left seoDescription empty.
	const description = resolveSeoDescription({
		seoDescription: product.seoDescription,
		body: product.description,
		fallbackName: product.name,
	});
	const ogImage = product.media?.[0]?.url || product.thumbnail?.url;

	return buildBrowsePageMetadata({
		title: product.seoTitle || product.name,
		description,
		image: ogImage,
		locale: params.locale,
		channel: params.channel,
		pathSuffix: catalogPathSuffix("products", product),
		pathSuffixByLocale: buildCatalogPathSuffixByLocale("products", buildLocaleSlugMap(product)),
		// Omit openGraph.type — Next rejects `product` (E237). ProductShell hoists
		// <meta property="og:type" content="product" /> only after the product resolves
		// (never on the 404 path).
		ogType: "product",
	});
}

// NOTE: generateStaticParams is intentionally omitted for product pages.
// All product pages are generated on-demand via ISR instead.

// ============================================================================
// Page Component
// ============================================================================

/**
 * Sync page entry — Suspense while params resolve and cached product data loads.
 * searchParams is passed through without being awaited here or in the shell.
 */
export default function ProductPage(props: {
	params: Promise<{ locale: string; slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string; sku?: string }>;
}) {
	const Skeleton = templates.pdp.Skeleton;
	return (
		<Suspense fallback={<Skeleton surface="page" />}>
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
	const intlLocale = resolveLocaleFromSlug(params.locale).bcp47;
	const policyLabels = buildPolicyLabelValues(content.policies, {
		currency,
		locale: intlLocale,
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

	const view = toProductView(product);
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
		description: resolveSeoDescription({
			seoDescription: product.seoDescription,
			body: product.description,
			fallbackName: product.name,
		}),
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

	const variantSectionFallback = (
		<VariantSectionFallback
			{...variantSectionFallbackProps({
				product,
				content,
				currency,
				locale: intlLocale,
				selectOptionsLabel: tPdp("selectOptions"),
			})}
		/>
	);

	const lcpImage = defaultImages[0];
	// Reserve mobile dots / desktop thumbs in fallback when product has multiple images
	const showGalleryChrome = defaultImages.length > 1;
	const { Fallback: GalleryFallback } = activeGalleryVariant();
	const galleryFallback = lcpImage ? (
		<GalleryFallback
			src={lcpImage.url}
			srcSet={lcpImage.srcSet}
			alt={lcpImage.alt ?? product.name}
			imageCount={defaultImages.length}
			showChrome={showGalleryChrome}
		/>
	) : null;

	const productAttributesNode = (
		<ProductAttributes
			descriptionHtml={view.descriptionHtml}
			attributes={view.attributes}
			careInstructions={view.careInstructions}
			policyLabels={policyLabels}
		/>
	);

	const Layout = templates.pdp.Layout;

	return (
		<>
			{/* Next rejects openGraph.type "product" (E237). Hoist after the product
			    exists so missing-slug 404s never advertise og:type=product. */}
			<meta property="og:type" content="product" />
			<CatalogIdentityBridge
				kind="products"
				primarySlug={product.slug}
				localeSlugs={buildLocaleSlugMap(product)}
			/>
			{productJsonLd && <script {...jsonLdScriptProps(productJsonLd)} />}

			{/* The browse layout (`(main)/layout.tsx`) owns the page's single <main> landmark. */}
			<Layout
				product={view}
				slots={{
					breadcrumbs: <Breadcrumbs items={breadcrumbs} ariaLabel={tNav("breadcrumbAriaLabel")} />,
					gallery: (
						<Suspense fallback={galleryFallback}>
							<VariantGalleryDynamic
								product={product}
								channel={params.channel}
								localeSlug={params.locale}
								searchParams={searchParams}
							/>
						</Suspense>
					),
					buyBox: (
						<ErrorBoundary FallbackComponent={VariantSectionError}>
							<Suspense fallback={variantSectionFallback}>
								<VariantSectionDynamic
									product={product}
									channel={params.channel}
									localeSlug={params.locale}
									searchParams={searchParams}
								/>
							</Suspense>
						</ErrorBoundary>
					),
					attributes: productAttributesNode,
				}}
			/>
		</>
	);
}
