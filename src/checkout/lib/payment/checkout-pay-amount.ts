import type { CheckoutFragment } from "@/checkout/graphql";
import type { ServerCheckout } from "@/checkout/lib/checkout-types";

type CheckoutWithTotal = Pick<CheckoutFragment, "totalPrice"> | ServerCheckout;

/** Ignore sub-cent drift when comparing displayed vs live checkout totals. */
export const CHECKOUT_TOTAL_CHANGE_EPSILON = 0.01;

export type CheckoutPriceChangeNotice = {
	previousAmount: number;
	newAmount: number;
	currency: string;
};

/** Gross total to authorize at payment time — Saleor expects this on transactionInitialize. */
export function getCheckoutPayAmount(checkout: CheckoutWithTotal): number | null {
	const amount = checkout.totalPrice?.gross?.amount;

	if (typeof amount !== "number" || Number.isNaN(amount)) {
		return null;
	}

	return amount;
}

export function getCheckoutPayCurrency(checkout: CheckoutWithTotal): string | null {
	const currency = checkout.totalPrice?.gross?.currency;
	return typeof currency === "string" && currency.length > 0 ? currency : null;
}

/** True when live total differs materially from what the customer was shown. */
export function hasMaterialCheckoutTotalChange(
	previousAmount: number,
	nextAmount: number,
	epsilon = CHECKOUT_TOTAL_CHANGE_EPSILON,
): boolean {
	return Math.abs(previousAmount - nextAmount) > epsilon;
}

export function buildCheckoutPriceChangeNotice(
	previousAmount: number,
	nextAmount: number,
	currency: string,
): CheckoutPriceChangeNotice {
	return { previousAmount, newAmount: nextAmount, currency };
}
