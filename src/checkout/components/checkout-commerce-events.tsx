"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { claimBeginCheckout } from "@/lib/analytics/claim";
import type { CheckoutStepSlug } from "@/lib/analytics/catalog";
import { emitCommerceEvent } from "@/lib/analytics/emit.client";
import { useCheckoutStepFromUrl } from "@/checkout/hooks/use-checkout-step-from-url";
import { useCheckoutData } from "@/checkout/providers/checkout-data";

const STEP_SLUGS: ReadonlySet<string> = new Set(["contact", "shipping", "payment"]);

function isStepSlug(value: string): value is CheckoutStepSlug {
	return STEP_SLUGS.has(value);
}

/**
 * Client-only checkout funnel. Never emit from RSC — CheckoutSessionLoader
 * re-renders on refresh/revalidate and would triple begin_checkout.
 */
function CheckoutCommerceEventsInner() {
	const { checkout, loadState } = useCheckoutData();
	const searchParams = useSearchParams();
	const isShippingRequired = checkout?.isShippingRequired ?? false;
	const currentStep = useCheckoutStepFromUrl(searchParams, isShippingRequired);
	const lastStep = useRef<string | null>(null);
	const lastCheckoutId = useRef<string | null>(null);

	const checkoutId = checkout?.id;
	const channel = checkout?.channel.slug;
	const checkoutValue = checkout?.totalPrice?.gross?.amount ?? 0;
	const checkoutCurrency = checkout?.totalPrice?.gross?.currency ?? "";
	const lineCount = checkout?.lines?.length ?? 0;

	useEffect(() => {
		if (loadState !== "ready" || !checkoutId || !channel) return;
		if (lineCount === 0) return;
		if (!claimBeginCheckout(checkoutId)) return;

		emitCommerceEvent({
			name: "checkout_started",
			channel,
			value: checkoutValue,
			currency: checkoutCurrency,
		});
	}, [channel, checkoutCurrency, checkoutId, checkoutValue, lineCount, loadState]);

	useEffect(() => {
		if (!checkoutId) {
			lastStep.current = null;
			lastCheckoutId.current = null;
			return;
		}
		if (lastCheckoutId.current !== checkoutId) {
			lastStep.current = null;
			lastCheckoutId.current = checkoutId;
		}
		if (loadState !== "ready" || !channel || lineCount === 0) return;
		if (!isStepSlug(currentStep.slug)) return;
		if (lastStep.current === currentStep.slug) return;
		lastStep.current = currentStep.slug;

		emitCommerceEvent({
			name: "checkout_step_viewed",
			channel,
			step: currentStep.slug,
		});
	}, [channel, checkoutId, currentStep.slug, lineCount, loadState]);

	return null;
}

export function CheckoutCommerceEvents() {
	return (
		<Suspense fallback={null}>
			<CheckoutCommerceEventsInner />
		</Suspense>
	);
}
