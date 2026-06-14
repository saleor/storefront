import { type ReadonlyURLSearchParams } from "next/navigation";

export type CheckoutStepType = "INFO" | "SHIPPING" | "PAYMENT";

export interface CheckoutStep {
	id: CheckoutStepType;
	label: string;
	/** 1-based index for display */
	index: number;
	/** Semantic slug for URL (e.g., "?step=contact") */
	slug: string;
}

export type CheckoutStepLabels = {
	information: string;
	shipping: string;
	payment: string;
};

const defaultStepLabels: CheckoutStepLabels = {
	information: "Information",
	shipping: "Shipping",
	payment: "Payment",
};

/**
 * Single source of truth for SaleorCheckout flow steps.
 * Handles conditional steps (like shipping) based on checkout state.
 */
export const getCheckoutSteps = (
	isShippingRequired: boolean,
	labels: CheckoutStepLabels = defaultStepLabels,
): CheckoutStep[] => {
	const steps: Omit<CheckoutStep, "index">[] = [{ id: "INFO", label: labels.information, slug: "contact" }];

	if (isShippingRequired) {
		steps.push({ id: "SHIPPING", label: labels.shipping, slug: "shipping" });
	}

	steps.push({ id: "PAYMENT", label: labels.payment, slug: "payment" });

	// Add 1-based indices
	return steps.map((step, i) => ({
		...step,
		index: i + 1,
	}));
};

/**
 * Get the step number for a specific step type.
 */
export const getStepNumber = (
	type: CheckoutStepType,
	isShippingRequired: boolean,
	labels: CheckoutStepLabels = defaultStepLabels,
): number => {
	const steps = getCheckoutSteps(isShippingRequired, labels);
	const step = steps.find((s) => s.id === type);
	return step ? step.index : -1;
};

/**
 * Get the step definition for a given step number.
 */
export const getStepByNumber = (
	number: number,
	isShippingRequired: boolean,
	labels: CheckoutStepLabels = defaultStepLabels,
): CheckoutStep | undefined => {
	const steps = getCheckoutSteps(isShippingRequired, labels);
	return steps.find((s) => s.index === number);
};

/**
 * Get step definition from semantic slug (e.g., "shipping").
 */
export const getStepBySlug = (
	slug: string,
	isShippingRequired: boolean,
	labels: CheckoutStepLabels = defaultStepLabels,
): CheckoutStep | undefined => {
	const steps = getCheckoutSteps(isShippingRequired, labels);
	return steps.find((s) => s.slug === slug);
};

/**
 * Parse the current step from URL search params.
 * Defaults to the first step if missing or invalid.
 */
export const getCurrentStepFromParams = (
	searchParams: ReadonlyURLSearchParams | URLSearchParams,
	isShippingRequired: boolean,
	labels: CheckoutStepLabels = defaultStepLabels,
): CheckoutStep => {
	const steps = getCheckoutSteps(isShippingRequired, labels);

	// Returning from Stripe 3DS — finish on payment even if step param was dropped.
	if (searchParams.get("processingPayment") === "true") {
		const paymentStep = steps.find((step) => step.id === "PAYMENT");
		if (paymentStep) {
			return paymentStep;
		}
	}

	const slug = searchParams.get("step");

	if (!slug) {
		return steps[0];
	}

	const step = steps.find((s) => s.slug === slug);
	return step || steps[0];
};
