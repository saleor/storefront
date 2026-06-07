import { useCallback, useEffect, useMemo, useRef } from "react";
import { flushSync } from "react-dom";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { updateCheckoutQuery, useLiveCheckoutSearchString } from "@/checkout/lib/checkout-search-params";
import type { ServerCheckout } from "@/checkout/lib/checkout-types";
import {
	getCheckoutSteps,
	getCurrentStepFromParams,
	type CheckoutStepType,
} from "@/checkout/views/saleor-checkout/flow";

type UseCheckoutStepOptions = {
	isShippingRequired: boolean;
	searchParams: ReadonlyURLSearchParams;
	setCheckout: (checkout: ServerCheckout) => void;
};

export function useCheckoutStep({ isShippingRequired, searchParams, setCheckout }: UseCheckoutStepOptions) {
	const searchString = useLiveCheckoutSearchString(searchParams.toString());
	const stepRef = useRef<HTMLDivElement>(null);

	const currentStep = useMemo(() => {
		const params = new URLSearchParams(searchString);
		return getCurrentStepFromParams(params, isShippingRequired);
	}, [isShippingRequired, searchString]);

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

			flushSync(() => {
				setCheckout(checkout);
			});
			updateCheckoutQuery({ step: step.slug });
		},
		[setCheckout],
	);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "instant" });
		stepRef.current?.focus();
	}, [currentStep.id]);

	return { currentStep, stepRef, goToStep, completeStep };
}
