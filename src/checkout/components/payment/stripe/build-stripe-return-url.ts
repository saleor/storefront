import { type ReadonlyURLSearchParams } from "next/navigation";
import { createQueryString } from "@/checkout/lib/utils/url";

/** Return URL for Stripe confirmPayment (3DS / redirect-based methods). */
export function buildStripeReturnUrl(searchParams: ReadonlyURLSearchParams, transactionId: string): string {
	const query = createQueryString(searchParams, {
		processingPayment: "true",
		transaction: transactionId,
		step: "payment",
	});

	return `${window.location.origin}${window.location.pathname}?${query}`;
}
