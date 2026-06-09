import { type CheckoutFragment } from "@/checkout/graphql";
import { isCheckoutFreeOrder } from "@/checkout/lib/payment/checkout-pay-amount";
import { isCheckoutReadyToComplete } from "@/checkout/lib/payment/checkout-payment-status";

type CheckoutPaymentUiState = Pick<
	CheckoutFragment,
	"authorizeStatus" | "totalPrice" | "subtotalPrice" | "discount"
>;

/**
 * Paid checkouts hide the PSP form once authorizeStatus is FULL.
 * $0 totals also reach FULL without a transaction but still need FreeOrderCheckout.
 */
export function shouldShowPaymentMethodArea(checkout: CheckoutPaymentUiState): boolean {
	if (isCheckoutFreeOrder(checkout)) {
		return true;
	}

	return !isCheckoutReadyToComplete(checkout);
}
