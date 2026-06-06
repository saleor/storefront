import { initializeCheckoutTransaction } from "@/app/(checkout)/actions";
import { getTransactionInitializeError } from "@/checkout/lib/payment-gateways";
import { type PaymentContext, type PaymentResult } from "../types";
import { completeCheckoutOrder } from "../complete-order";

/**
 * Saleor Dummy Payment app — test checkouts only.
 * Simulates a successful charge via transactionInitialize + checkoutComplete.
 */
export async function executeDummyPayment(
	context: PaymentContext,
	gatewayId: string,
): Promise<PaymentResult> {
	const initResult = await initializeCheckoutTransaction({
		checkoutId: context.checkoutId,
		paymentGateway: {
			id: gatewayId,
			data: {
				event: {
					includePspReference: true,
					type: "CHARGE_SUCCESS",
				},
			},
		},
	});

	if (!initResult.ok) {
		console.error("Payment initialization error:", initResult.error);
		return { ok: false, error: "Payment failed. Please try again.", errorKey: "payment" };
	}

	const transactionError = getTransactionInitializeError(initResult.data);
	if (transactionError) {
		console.error("Transaction initialize failed:", initResult.data);
		return { ok: false, error: transactionError, errorKey: "payment" };
	}

	return completeCheckoutOrder(context.checkoutId);
}
