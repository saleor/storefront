import type { CheckoutFragment } from "@/checkout/graphql";

type DeliveryProblemType = "CheckoutProblemDeliveryMethodStale" | "CheckoutProblemDeliveryMethodInvalid";

export function hasDeliveryProblem(checkout: CheckoutFragment, type: DeliveryProblemType): boolean {
	return checkout.problems?.some((p) => p.__typename === type) ?? false;
}

export function hasStaleDeliveryProblem(checkout: CheckoutFragment | null): boolean {
	if (!checkout) return false;
	return hasDeliveryProblem(checkout, "CheckoutProblemDeliveryMethodStale");
}
