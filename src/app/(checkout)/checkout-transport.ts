import {
	initializeCheckoutTransaction,
	initializePaymentGateways,
	processCheckoutTransaction,
	runCheckoutComplete,
	syncCheckoutFromServer,
	updateCheckoutBillingAddress,
} from "@/app/(checkout)/actions";
import type { CheckoutTransport } from "@/checkout/lib/checkout-transport";

/**
 * Next.js implementation of `CheckoutTransport`: each method is a server action,
 * so auth (HttpOnly Saleor JWT cookies), the server-side amount-tamper guard, and
 * post-complete `after()` cleanup all keep running server-side unchanged.
 */
export const nextCheckoutTransport: CheckoutTransport = {
	fetchCheckout: syncCheckoutFromServer,
	updateBillingAddress: updateCheckoutBillingAddress,
	initializePaymentGateways,
	initializeTransaction: initializeCheckoutTransaction,
	processTransaction: processCheckoutTransaction,
	completeCheckout: runCheckoutComplete,
};
