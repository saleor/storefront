import { useCallback, useEffect, useRef } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { updateCheckoutQuery } from "@/checkout/lib/checkout-search-params";
import { useCheckoutStepFromUrl } from "@/checkout/hooks/use-checkout-step-from-url";
import type { ServerCheckout } from "@/checkout/lib/checkout-types";
import { getCheckoutSteps, type CheckoutStepType } from "@/checkout/views/saleor-checkout/flow";

type UseCheckoutStepOptions = {
	isShippingRequired: boolean;
	searchParams: ReadonlyURLSearchParams;
	setCheckout: (checkout: ServerCheckout) => void;
};

export function useCheckoutStep({ isShippingRequired, searchParams, setCheckout }: UseCheckoutStepOptions) {
	const stepRef = useRef<HTMLDivElement>(null);
	const currentStep = useCheckoutStepFromUrl(searchParams, isShippingRequired);

	const goToStep = useCallback(
		(stepType: CheckoutStepType) => {
			const step = getCheckoutSteps(isShippingRequired).find((s) => s.id === stepType);
			if (!step) return;
			updateCheckoutQuery({ step: step.slug });
		},
		[isShippingRequired],
	);

	const completeStep = useCallback(
		(checkout: ServerCheckout, stepType: CheckoutStepType) => {
			const step = getCheckoutSteps(checkout.isShippingRequired).find((s) => s.id === stepType);
			if (!step) return;

			setCheckout(checkout);
			updateCheckoutQuery({ step: step.slug }, { history: "push" });
		},
		[setCheckout],
	);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" });
		stepRef.current?.focus();
	}, [currentStep.id]);

	return { currentStep, stepRef, goToStep, completeStep };
}
