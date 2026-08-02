import { useCallback, useEffect, useRef } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { formatPageTitle } from "@/config/brand";
import { updateCheckoutQuery } from "@/checkout/lib/checkout-search-params";
import { useCheckoutStepFromUrl } from "@/checkout/hooks/use-checkout-step-from-url";
import { useCheckoutStepLabels, useCheckoutSteps } from "@/checkout/hooks/use-checkout-steps";
import type { ServerCheckout } from "@/checkout/lib/checkout-types";
import type { CheckoutStepType } from "@/checkout/views/saleor-checkout/flow";
import { getCheckoutSteps } from "@/checkout/views/saleor-checkout/flow";

type UseCheckoutStepOptions = {
	isShippingRequired: boolean;
	searchParams: ReadonlyURLSearchParams;
	setCheckout: (checkout: ServerCheckout) => void;
};

export function useCheckoutStep({ isShippingRequired, searchParams, setCheckout }: UseCheckoutStepOptions) {
	const stepRef = useRef<HTMLDivElement>(null);
	const currentStep = useCheckoutStepFromUrl(searchParams, isShippingRequired);
	const labels = useCheckoutStepLabels();
	const steps = useCheckoutSteps(isShippingRequired);

	const goToStep = useCallback(
		(stepType: CheckoutStepType) => {
			const step = steps.find((s) => s.id === stepType);
			if (!step) return;
			updateCheckoutQuery({ step: step.slug });
		},
		[steps],
	);

	const completeStep = useCallback(
		(checkout: ServerCheckout, stepType: CheckoutStepType) => {
			const nextSteps = getCheckoutSteps(checkout.isShippingRequired, labels);
			const step = nextSteps.find((s) => s.id === stepType);
			if (!step) return;

			setCheckout(checkout);
			updateCheckoutQuery({ step: step.slug }, { history: "push" });
		},
		[setCheckout, labels],
	);

	// Shallow ?step= writes bypass the App Router, so Next's metadata never updates —
	// title the document per step so history entries and the tab read "Checkout — Payment",
	// not three identical "Checkout" rows. `searchParams` is a dep because router commits
	// (mount/unmount syncs, action revalidations) re-apply the route's static metadata
	// title, which must be re-overridden.
	useEffect(() => {
		document.title = formatPageTitle(`Checkout — ${currentStep.label}`);
	}, [currentStep.label, searchParams]);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" });
		stepRef.current?.focus();
	}, [currentStep.id]);

	return { currentStep, stepRef, goToStep, completeStep };
}
