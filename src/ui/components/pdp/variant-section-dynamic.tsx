import { formatMoney, formatMoneyRange } from "@/lib/utils";
import { resolveLocaleFromSlug } from "@/config/locale";
import { getDiscountInfo } from "@/lib/pricing";
import { resolveChannelCurrency } from "@/lib/channels/resolve-channel-currency";
import { getStorefrontContent } from "@/lib/content/server";
import {
	revalidateStorefrontBrowsePath,
	revalidateStorefrontChrome,
} from "@/lib/auth/revalidate-storefront-chrome";
import { CheckoutAddLineDocument } from "@/gql/graphql";
import { executeAuthenticatedGraphQL } from "@/lib/graphql";
import * as Checkout from "@/lib/checkout";
import { getTranslations } from "next-intl/server";
import { resolvePdpVariants } from "@/lib/catalog/get-product-data";
import { pickTranslatedSlug } from "@/lib/saleor-translations";

import { AddToCart } from "./add-to-cart";
import { NonMatrixBuyBox } from "./non-matrix-buy-box";
import { VariantSelectionSection } from "./variant-selection";
import { StickyBar } from "./sticky-bar";
import { Badge } from "@/ui/components/ui/badge";
import { SaleBadge } from "@/ui/components/ui/sale-label";
import { resolveSelectedVariantId, type Product } from "./gallery-utils";

interface VariantSectionDynamicProps {
	product: Product;
	channel: string;
	localeSlug: string;
	searchParams: Promise<{ variant?: string; sku?: string }>;
}

/**
 * Dynamic variant section for PDP.
 *
 * Reads searchParams inside a Suspense boundary so the product shell
 * (name, attributes, JSON-LD) stays in the static prerender cache.
 * Variants + buy-box strategy are resolved here via {@link resolvePdpVariants}
 * — never inside the shell — so high-cardinality catalogs cannot inflate the
 * static RSC payload or leak strategy branching into the prerender.
 */
export async function VariantSectionDynamic({
	product,
	channel,
	localeSlug,
	searchParams,
}: VariantSectionDynamicProps) {
	const { variant: variantParam, sku: skuParam } = await searchParams;
	const intlLocale = resolveLocaleFromSlug(localeSlug).bcp47;

	const [t, content, currency, variantResult] = await Promise.all([
		getTranslations({ locale: localeSlug, namespace: "pdp" }),
		getStorefrontContent(channel, localeSlug),
		resolveChannelCurrency(channel),
		resolvePdpVariants(product, channel, localeSlug, {
			variantId: variantParam,
			sku: skuParam,
		}),
	]);

	const { variants, totalCount, overBudget, strategy } = variantResult;
	const productWithVariants: Product = {
		...product,
		variants,
		variantTotalCount: totalCount,
		overVariantBudget: overBudget,
	};

	const selectedVariantID = resolveSelectedVariantId(productWithVariants, variantParam);
	const selectedVariant = variants.find(({ id }) => id === selectedVariantID);

	const isAvailable =
		strategy !== "matrix"
			? Boolean(selectedVariant?.quantityAvailable) || (product.isAvailable ?? false)
			: variants.some((variant) => variant.quantityAvailable);

	// Prefer no-selection over out-of-stock when the URL names a variant we couldn't hydrate.
	const isAddToCartDisabled = !selectedVariantID || !selectedVariant?.quantityAvailable;
	const disabledReason = !selectedVariant
		? ("no-selection" as const)
		: !selectedVariant.quantityAvailable
			? ("out-of-stock" as const)
			: undefined;

	const price = selectedVariant?.pricing?.price?.gross
		? selectedVariant.pricing.price.gross.amount === 0
			? t("free")
			: formatMoney(
					selectedVariant.pricing.price.gross.amount,
					selectedVariant.pricing.price.gross.currency,
					intlLocale,
				)
		: formatMoneyRange(
				{
					start: product.pricing?.priceRange?.start?.gross,
					stop: product.pricing?.priceRange?.stop?.gross,
				},
				intlLocale,
			) || "";

	const currentPrice = selectedVariant?.pricing?.price?.gross?.amount;
	const undiscountedPrice = selectedVariant?.pricing?.priceUndiscounted?.gross?.amount;
	const { isOnSale, discountPercent } = getDiscountInfo(currentPrice, undiscountedPrice);

	const compareAtPrice =
		isOnSale && selectedVariant?.pricing?.priceUndiscounted?.gross
			? formatMoney(
					selectedVariant.pricing.priceUndiscounted.gross.amount,
					selectedVariant.pricing.priceUndiscounted.gross.currency,
					intlLocale,
				)
			: null;

	const freeShippingThreshold = content.policies.shipping.freeShippingThreshold;
	const freeShippingTrustLabel =
		freeShippingThreshold != null
			? `${content.surfaces.cart.trust.freeShippingPrefix} ${formatMoney(
					freeShippingThreshold,
					currency,
					intlLocale,
				)}`
			: null;
	const secureCheckoutLabel = content.surfaces.checkout.trust.secureCheckout;

	async function addToCart() {
		"use server";

		if (!selectedVariantID) {
			return;
		}

		try {
			const checkout = await Checkout.findOrCreate({
				checkoutId: await Checkout.getIdFromCookies(channel),
				channel: channel,
				localeSlug,
			});

			if (!checkout) {
				console.error("Add to cart: Failed to create checkout");
				return;
			}

			await Checkout.saveIdToCookie(channel, checkout.id);

			const addResult = await executeAuthenticatedGraphQL(CheckoutAddLineDocument, {
				variables: {
					id: checkout.id,
					productVariantId: decodeURIComponent(selectedVariantID),
				},
				cache: "no-cache",
			});

			if (!addResult.ok) {
				console.error("Add to cart failed:", addResult.error.message);
				return;
			}

			revalidateStorefrontBrowsePath(channel, "/cart");
			revalidateStorefrontChrome(channel);
		} catch (error) {
			console.error("Add to cart failed:", error);
		}
	}

	const buyBox =
		strategy === "matrix" ? (
			<VariantSelectionSection
				variants={variants}
				selectedVariantId={selectedVariantID}
				productSlug={pickTranslatedSlug(product)}
				channel={channel}
			/>
		) : (
			<NonMatrixBuyBox
				strategy={strategy}
				selectedVariant={selectedVariant}
				hint={strategy === "external" ? t("buyBox.externalHint") : t("buyBox.overBudgetHint")}
				summaryLabel={t("buyBox.selectedSummary")}
			/>
		);

	return (
		<>
			<div className="order-1 flex items-center gap-2">
				{product.category && <span className="text-sm text-muted-foreground">{product.category.name}</span>}
				{isOnSale && <SaleBadge />}
				{!isAvailable && (
					<Badge variant="secondary" className="text-xs">
						{t("outOfStock")}
					</Badge>
				)}
			</div>

			<form action={addToCart} className="order-3 mt-4 space-y-6">
				{buyBox}

				<AddToCart
					price={price}
					compareAtPrice={compareAtPrice}
					discountPercent={discountPercent}
					disabled={isAddToCartDisabled}
					disabledReason={disabledReason}
					secureCheckoutLabel={secureCheckoutLabel}
					freeShippingTrustLabel={freeShippingTrustLabel}
				/>

				<StickyBar productName={product.name} price={price} show={!isAddToCartDisabled} />
			</form>
		</>
	);
}

/**
 * Skeleton fallback for variant section.
 *
 * Uses delayed visibility (300ms) to prevent flash on fast loads.
 * Part of the static shell - shows while variant data streams in.
 */
export function VariantSectionSkeleton() {
	return (
		<>
			<div className="order-1 h-4 w-20 animate-pulse animate-skeleton-delayed rounded bg-muted opacity-0" />

			<div className="order-3 mt-4 animate-pulse animate-skeleton-delayed space-y-6 opacity-0">
				<div className="space-y-4">
					<div className="h-4 w-16 rounded bg-muted" />
					<div className="flex gap-2">
						<div className="h-10 w-16 rounded bg-muted" />
						<div className="h-10 w-16 rounded bg-muted" />
						<div className="h-10 w-16 rounded bg-muted" />
					</div>
				</div>

				<div className="h-8 w-24 rounded bg-muted" />

				<div className="h-12 w-full rounded bg-muted" />
			</div>
		</>
	);
}
