import type { PaperCommerceEvent } from "@/lib/analytics/catalog";

/** Recommended tag event + params. `items[]` waits on richer catalog fields. */
export type Ga4Event = {
	name: string;
	params: Record<string, string | number | boolean>;
};

/**
 * Project a Paper event onto recommended tag names. Search text is never a
 * param. Contact is not a checkout-step event — skip it. Server delivery
 * is not shipped; this function is payload-only.
 */
export function projectGa4(event: PaperCommerceEvent): Ga4Event | null {
	switch (event.name) {
		case "product_added_to_cart":
			if (!event.currency) return null;
			return { name: "add_to_cart", params: { currency: event.currency, value: event.value } };
		case "checkout_started":
			if (!event.currency) return null;
			return { name: "begin_checkout", params: { currency: event.currency, value: event.value } };
		case "checkout_step_viewed":
			if (event.step === "shipping") return { name: "add_shipping_info", params: {} };
			if (event.step === "payment") return { name: "add_payment_info", params: {} };
			return null;
		case "checkout_completed":
			if (!event.currency || !event.transactionId) return null;
			return {
				name: "purchase",
				params: {
					transaction_id: event.transactionId,
					currency: event.currency,
					value: event.value,
				},
			};
		case "search_submitted":
			return { name: "search", params: {} };
	}
}
