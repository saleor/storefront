import { type ReadonlyURLSearchParams } from "next/navigation";

export type CheckoutStepType = "INFO" | "SHIPPING" | "PAYMENT" | "CONFIRMATION";

interface CheckoutStep {
	id: CheckoutStepType;
	label: string;
	/** 1-based index for display */
	index: number;
	/** Semantic slug for URL (e.g., "?step=contact") */
	slug: string;
}

/**
 * Single source of truth for SaleorCheckout flow steps.
 * Handles conditional steps (like shipping) based on checkout state.
 */
export const getCheckoutSteps = (isShippingRequired: boolean): CheckoutStep[] => {
	const steps: Omit<CheckoutStep, "index">[] = [{ id: "INFO", label: "Information", slug: "contact" }];

	if (isShippingRequired) {
		steps.push({ id: "SHIPPING", label: "Shipping", slug: "shipping" });
	}

	steps.push(
		{ id: "PAYMENT", label: "Payment", slug: "payment" },
		{ id: "CONFIRMATION", label: "Confirmation", slug: "confirmation" },
	);

	// Add 1-based indices
	return steps.map((step, i) => ({
		...step,
		index: i + 1,
	}));
};

/**
 * Get the step number for a specific step type.
 */
export const getStepNumber = (type: CheckoutStepType, isShippingRequired: boolean): number => {
	const steps = getCheckoutSteps(isShippingRequired);
	const step = steps.find((s) => s.id === type);
	return step ? step.index : -1;
};

/**
 * Get the step definition for a given step number.
 */
export const getStepByNumber = (number: number, isShippingRequired: boolean): CheckoutStep | undefined => {
	const steps = getCheckoutSteps(isShippingRequired);
	return steps.find((s) => s.index === number);
};

/**
 * Get step definition from semantic slug (e.g., "shipping").
 */
export const getStepBySlug = (slug: string, isShippingRequired: boolean): CheckoutStep | undefined => {
	const steps = getCheckoutSteps(isShippingRequired);
	return steps.find((s) => s.slug === slug);
};

/**
 * Parse the current step from URL search params.
 * Defaults to the first step if missing or invalid.
 */
export const getCurrentStepFromParams = (
	searchParams: ReadonlyURLSearchParams,
	isShippingRequired: boolean,
): CheckoutStep => {
	const steps = getCheckoutSteps(isShippingRequired);
	const slug = searchParams.get("step");

	if (!slug) {
		return steps[0];
	}

	const step = steps.find((s) => s.slug === slug);
	return step || steps[0];
};
