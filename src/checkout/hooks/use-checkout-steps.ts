"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
	getCheckoutSteps,
	getCurrentStepFromParams,
	getStepNumber,
	type CheckoutStep,
	type CheckoutStepType,
} from "@/checkout/views/saleor-checkout/flow";
import type { ReadonlyURLSearchParams } from "next/navigation";

import type { CheckoutStepLabels } from "@/checkout/views/saleor-checkout/flow";

export type { CheckoutStepLabels };

export function useCheckoutStepLabels(): CheckoutStepLabels {
	const t = useTranslations("checkout.steps");
	return {
		information: t("information"),
		shipping: t("shipping"),
		payment: t("payment"),
	};
}

export function useCheckoutSteps(isShippingRequired: boolean): CheckoutStep[] {
	const labels = useCheckoutStepLabels();
	return useMemo(() => getCheckoutSteps(isShippingRequired, labels), [isShippingRequired, labels]);
}

export function useCheckoutStepNumber(type: CheckoutStepType, isShippingRequired: boolean): number {
	const labels = useCheckoutStepLabels();
	return useMemo(() => getStepNumber(type, isShippingRequired, labels), [type, isShippingRequired, labels]);
}

export function useCurrentCheckoutStepFromParams(
	searchParams: ReadonlyURLSearchParams | URLSearchParams,
	isShippingRequired: boolean,
): CheckoutStep {
	const labels = useCheckoutStepLabels();
	return useMemo(
		() => getCurrentStepFromParams(searchParams, isShippingRequired, labels),
		[searchParams, isShippingRequired, labels],
	);
}
