/**
 * Paper commerce event catalog.
 *
 * Call sites emit one of these. Destinations project: Web Analytics gets two
 * flat props; the merchant tag gets recommended names (client + consent;
 * server delivery later). Never put track / tag / pixel calls in components.
 */
export const PAPER_COMMERCE_EVENT_VERSION = 1 as const;

export type CheckoutStepSlug = "contact" | "shipping" | "payment";

export type PaperCommerceEvent =
	| {
			name: "product_added_to_cart";
			channel: string;
			value: number;
			currency: string;
	  }
	| {
			name: "checkout_started";
			channel: string;
			value: number;
			currency: string;
	  }
	| {
			name: "checkout_step_viewed";
			channel: string;
			step: CheckoutStepSlug;
	  }
	| {
			name: "checkout_completed";
			channel: string;
			value: number;
			currency: string;
			/** Saleor order id — GA transaction_id later; never a Vercel property. */
			transactionId: string;
	  }
	| {
			name: "search_submitted";
			channel: string;
			/** True when the result set is empty. Search text never leaves the browser. */
			zero: boolean;
	  };
