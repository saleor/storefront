import { runCheckoutComplete } from "@/app/(checkout)/actions";
import { type PaymentResult } from "./types";

/** Shared final step: convert checkout to order after payment is authorized. */
export async function completeCheckoutOrder(checkoutId: string): Promise<PaymentResult> {
	const result = await runCheckoutComplete(checkoutId);

	if (!result.ok) {
		return {
			ok: false,
			error: result.error,
			errorKey: "payment",
		};
	}

	return { ok: true, orderId: result.orderId };
}
