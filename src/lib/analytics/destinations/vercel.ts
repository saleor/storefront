import type { PaperCommerceEvent } from "@/lib/analytics/catalog";

/** Vercel Pro allows two custom properties. Values must stay low-cardinality. */
export type VercelCustomEvent = {
	name: string;
	props: Record<string, string | number | boolean>;
};

/**
 * Project a Paper event onto Web Analytics custom events.
 * Returns null when this destination should skip (never happens for phase-1 events).
 */
export function projectVercel(event: PaperCommerceEvent): VercelCustomEvent | null {
	switch (event.name) {
		case "product_added_to_cart":
			if (!event.channel) return null;
			return { name: "add_to_cart", props: { channel: event.channel, value: event.value } };
		case "checkout_started":
			if (!event.channel) return null;
			return { name: "begin_checkout", props: { channel: event.channel, value: event.value } };
		case "checkout_step_viewed":
			if (!event.channel) return null;
			return { name: "checkout_step", props: { step: event.step, channel: event.channel } };
		case "checkout_completed":
			if (!event.currency) return null;
			return { name: "purchase", props: { currency: event.currency, value: event.value } };
		case "search_submitted":
			if (!event.channel) return null;
			return { name: "search", props: { zero: event.zero, channel: event.channel } };
	}
}
