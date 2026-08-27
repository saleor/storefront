import { ShoppingBag } from "lucide-react";

import type { StorefrontContent } from "@/lib/content";
import { formatMoney, formatMoneyRange } from "@/lib/utils";
import { Button } from "@/ui/components/ui/button";

/**
 * Pulse bars for {@link ProductRouteSkeleton} — no product data is available yet.
 * Do not use this as the in-page island fallback: after the Saleor CDN LCP image
 * paints, pulse bars on the buy box read as a stall (the hole's RSC TTFB is often
 * just over the 300ms delay).
 */
export function VariantSectionSkeleton() {
	return (
		<>
			<div className="order-1 h-4 w-20 animate-pulse rounded bg-muted" />

			<div className="order-3 mt-4 animate-pulse space-y-6">
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

export interface VariantSectionFallbackProps {
	categoryName?: string | null;
	price: string;
	selectOptionsLabel: string;
	secureCheckoutLabel: string;
	freeShippingTrustLabel?: string | null;
}

type FallbackProduct = {
	category?: { name?: string | null } | null;
	pricing?: {
		priceRange?: {
			start?: { gross?: { amount: number; currency: string } | null } | null;
			stop?: { gross?: { amount: number; currency: string } | null } | null;
		} | null;
	} | null;
};

/** Props for {@link VariantSectionFallback} from data the PDP shell already has. */
export function variantSectionFallbackProps(input: {
	product: FallbackProduct;
	content: StorefrontContent;
	currency: string;
	locale: string;
	selectOptionsLabel: string;
}): VariantSectionFallbackProps {
	const { product, content, currency, locale, selectOptionsLabel } = input;
	const threshold = content.policies.shipping.freeShippingThreshold;
	return {
		categoryName: product.category?.name,
		price:
			formatMoneyRange(
				{
					start: product.pricing?.priceRange?.start?.gross,
					stop: product.pricing?.priceRange?.stop?.gross,
				},
				locale,
			) || "",
		selectOptionsLabel,
		secureCheckoutLabel: content.surfaces.checkout.trust.secureCheckout,
		freeShippingTrustLabel:
			threshold != null
				? `${content.surfaces.cart.trust.freeShippingPrefix} ${formatMoney(threshold, currency, locale)}`
				: null,
	};
}

/**
 * Server-only buy-box chrome from the PPR shell (category, price range, disabled ATC).
 * Must not import `AddToCart` — that client island would land in the static fallback
 * with no `<form>` and pull `useFormStatus` into every PDP shell.
 * Selectors stay in the searchParams island.
 */
export function VariantSectionFallback({
	categoryName,
	price,
	selectOptionsLabel,
	secureCheckoutLabel,
	freeShippingTrustLabel,
}: VariantSectionFallbackProps) {
	return (
		<>
			<div className="order-1 flex items-center gap-2">
				{categoryName ? <span className="text-sm text-muted-foreground">{categoryName}</span> : null}
			</div>

			<div className="order-3 mt-4 space-y-6" aria-busy="true">
				<div className="space-y-4">
					<div className="flex items-baseline gap-3">
						<span className="text-2xl font-semibold tabular-nums tracking-tight">{price}</span>
					</div>
					<Button type="button" size="lg" disabled className="h-14 w-full text-base font-medium">
						<ShoppingBag className="mr-2 h-5 w-5" />
						{selectOptionsLabel}
					</Button>
					<div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<svg
								className="h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
							>
								<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
							</svg>
							{secureCheckoutLabel}
						</span>
						{freeShippingTrustLabel ? (
							<span className="flex items-center gap-1.5">
								<svg
									className="h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
								>
									<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
									<path d="M9 22V12h6v10" />
								</svg>
								{freeShippingTrustLabel}
							</span>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}
