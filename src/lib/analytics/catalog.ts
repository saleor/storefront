/**
 * Paper commerce event catalog — Shopify-shaped moment names, Saleor-shaped fields.
 *
 * Call sites emit one of these. Destinations project: Vercel gets two flat props,
 * GA4 (phase 2) gets recommended names + items[], others map the same union.
 * Never put gtag / track / pixel calls in components.
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
