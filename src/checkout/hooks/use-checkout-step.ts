import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { type ReadonlyURLSearchParams } from "next/navigation";

import type { ServerCheckout } from "@/checkout/lib/checkout-types";
import { createQueryString } from "@/checkout/lib/utils/url";
import {
	getCheckoutSteps,
	getCurrentStepFromParams,
	type CheckoutStep,
	type CheckoutStepType,
} from "@/checkout/views/saleor-checkout/flow";

type UseCheckoutStepOptions = {
	isShippingRequired: boolean;
	searchParams: ReadonlyURLSearchParams;
	setCheckout: (checkout: ServerCheckout) => void;
};

/** Prefer the real URL bar over Next's searchParams (can lag after client navigation). */
function readStepFromUrl(isShippingRequired: boolean): CheckoutStep {
	const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
	return getCurrentStepFromParams(params, isShippingRequired);
}

export function useCheckoutStep({ isShippingRequired, searchParams, setCheckout }: UseCheckoutStepOptions) {
	const [currentStep, setCurrentStep] = useState<CheckoutStep>(() => readStepFromUrl(isShippingRequired));
	const stepRef = useRef<HTMLDivElement>(null);

	const syncStepUrl = useCallback(
		(step: CheckoutStep) => {
			// Use the live URL bar — React searchParams can lag behind replaceState and would
			// drop Stripe return params (payment_intent, processingPayment) on step sync.
			const liveParams =
				typeof window !== "undefined"
					? new URLSearchParams(window.location.search)
					: new URLSearchParams(searchParams.toString());
			const query = createQueryString(liveParams as ReadonlyURLSearchParams, { step: step.slug });
			window.history.replaceState(window.history.state, "", `${window.location.pathname}?${query}`);
		},
		[searchParams],
	);

	const goToStep = useCallback(
		(stepType: CheckoutStepType) => {
			const step = getCheckoutSteps(isShippingRequired).find((s) => s.id === stepType);
			if (!step) return;
			setCurrentStep(step);
			syncStepUrl(step);
		},
		[isShippingRequired, syncStepUrl],
	);

	const completeStep = useCallback(
		(checkout: ServerCheckout, stepType: CheckoutStepType) => {
			const step = getCheckoutSteps(checkout.isShippingRequired).find((s) => s.id === stepType);
			if (!step) return;

			flushSync(() => {
				setCheckout(checkout);
				setCurrentStep(step);
			});
			syncStepUrl(step);
		},
		[setCheckout, syncStepUrl],
	);

	const resolvedStep = useMemo(() => {
		const steps = getCheckoutSteps(isShippingRequired);
		return steps.find((s) => s.id === currentStep.id) ?? steps[0];
	}, [currentStep.id, isShippingRequired]);

	// Re-sync when the route search params change (cart → checkout). Step changes inside
	// checkout use replaceState only, so searchParams does not update for those.
	const searchKey = searchParams.toString();
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect -- external URL navigation
		setCurrentStep(readStepFromUrl(isShippingRequired));
	}, [searchKey, isShippingRequired]);

	useEffect(() => {
		const onPopState = () => {
			setCurrentStep(readStepFromUrl(isShippingRequired));
		};
		window.addEventListener("popstate", onPopState);
		return () => window.removeEventListener("popstate", onPopState);
	}, [isShippingRequired]);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" });
		stepRef.current?.focus();
	}, [resolvedStep.id]);

	return { currentStep: resolvedStep, stepRef, goToStep, completeStep };
}
