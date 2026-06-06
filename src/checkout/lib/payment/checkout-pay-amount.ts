import type { CheckoutFragment } from "@/checkout/graphql";
import type { ServerCheckout } from "@/checkout/lib/checkout-types";

type CheckoutWithTotal = Pick<CheckoutFragment, "totalPrice" | "subtotalPrice" | "discount"> | ServerCheckout;

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

/** Stripe Elements `amount` in minor units — must be > 0 or Stripe throws. */
export function getCheckoutPayAmountInCents(checkout: CheckoutWithTotal): number | null {
	const amount = getCheckoutPayAmount(checkout);

	if (amount === null || amount <= 0) {
		return null;
	}

	const cents = Math.round(amount * 100);
	return cents > 0 ? cents : null;
}

/** True when checkout total is exactly zero (e.g. 100% discount) — no card charge needed. */
export function isCheckoutFreeOrder(checkout: CheckoutWithTotal): boolean {
	return getCheckoutPayAmount(checkout) === 0;
}

/**
 * Total is 0 but line subtotal is positive — usually stale pricing before shipping/tax sync.
 * Skipped for confirmed free orders (e.g. 100% discount) where a zero total is expected.
 */
export function hasCheckoutTotalLoadingMismatch(checkout: CheckoutWithTotal): boolean {
	if (isCheckoutFreeOrder(checkout)) {
		const subtotal = checkout.subtotalPrice?.gross?.amount;
		const discount = checkout.discount?.amount;
		if (typeof subtotal === "number" && subtotal > 0) {
			// 100% discount: subtotal positive, discount covers it, total is 0.
			if (typeof discount === "number" && discount >= subtotal) {
				return false;
			}
		}
	}

	if (getCheckoutPayAmount(checkout) !== 0) {
		return false;
	}

	const subtotal = checkout.subtotalPrice?.gross?.amount;
	return typeof subtotal === "number" && subtotal > 0;
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
