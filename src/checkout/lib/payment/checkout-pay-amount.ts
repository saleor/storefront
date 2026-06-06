import type { CheckoutFragment } from "@/checkout/graphql";
import type { ServerCheckout } from "@/checkout/lib/checkout-types";

type CheckoutWithTotal = Pick<CheckoutFragment, "totalPrice"> | ServerCheckout;

/** Gross total to authorize at payment time — Saleor expects this on transactionInitialize. */
export function getCheckoutPayAmount(checkout: CheckoutWithTotal): number | null {
	const amount = checkout.totalPrice?.gross?.amount;

	if (typeof amount !== "number" || Number.isNaN(amount)) {
		return null;
	}

	return amount;
}
