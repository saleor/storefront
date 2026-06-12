import { type CheckoutAuthorizeStatusEnum, type CheckoutChargeStatusEnum } from "@/checkout/graphql";

/**
 * Saleor treats a checkout as payable when authorized + charged + pending amounts
 * cover checkout.totalPrice — capture is NOT required at checkout time.
 *
 * @see https://docs.saleor.io/developer/payments/lifecycle#authorization-status-calculation-for-checkout
 * @see https://docs.saleor.io/developer/payments/transactions#automatic-checkout-completion
 */
export function isCheckoutReadyToComplete(checkout: {
	authorizeStatus: CheckoutAuthorizeStatusEnum;
}): boolean {
	return checkout.authorizeStatus === "FULL";
}

export type CheckoutPaymentCoverage = "none" | "authorized" | "charged" | "overcharged";

/**
 * Mirrors the reference checkout payment status helper.
 * "authorized" = fully covered by authorization, not yet captured (manual capture flow).
 */
export function getCheckoutPaymentCoverage(checkout: {
	authorizeStatus: CheckoutAuthorizeStatusEnum;
	chargeStatus: CheckoutChargeStatusEnum;
}): CheckoutPaymentCoverage {
	if (checkout.chargeStatus === "OVERCHARGED") {
		return "overcharged";
	}

	if (checkout.chargeStatus === "FULL") {
		return "charged";
	}

	if (checkout.chargeStatus === "NONE" && checkout.authorizeStatus === "FULL") {
		return "authorized";
	}

	return "none";
}

/** Whether checkoutComplete can be called (authorization coverage is enough). */
export function canCallCheckoutComplete(checkout: { authorizeStatus: CheckoutAuthorizeStatusEnum }): boolean {
	return isCheckoutReadyToComplete(checkout);
}
