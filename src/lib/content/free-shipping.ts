import type { StorefrontContent } from "@/lib/content/types";

type ShippingMethodPrices = {
	price: { amount: number };
	minimumOrderPrice?: { amount: number } | null;
};

/**
 * The order value from which Saleor offers a shipping method that costs nothing: the
 * smallest `minimumOrderPrice` among the price-0 methods. `null` when there is no such
 * method, and when one has no minimum (shipping is then always free, so there is no
 * threshold to advertise).
 */
export function freeShippingThresholdFromMethods(
	methods: ReadonlyArray<ShippingMethodPrices> | null | undefined,
): number | null {
	const minimums = (methods ?? [])
		.filter((method) => method.price.amount === 0)
		.map((method) => method.minimumOrderPrice?.amount ?? 0);
	if (minimums.length === 0) {
		return null;
	}

	const threshold = Math.min(...minimums);
	return threshold > 0 ? threshold : null;
}

/**
 * Settle the free-shipping threshold the storefront advertises (announcement bar, product
 * page label, cart progress bar):
 *
 * 1. Saleor's shipping methods for the channel's default country are the source.
 * 2. "Free shipping threshold override (not recommended)" on the Storefront — Policies
 *    Model overrides it when set. It exists for a store that has to advertise something
 *    other than its default country's method; everyone else leaves it empty.
 * 3. Neither: `null`, and the storefront shows no threshold copy. Paper has no fallback
 *    figure of its own.
 *
 * An override that differs from Saleor promises something checkout does not deliver, so
 * development builds warn about it.
 */
export function withFreeShippingThreshold(
	content: StorefrontContent,
	fromSaleor: number | null,
	context: { channel: string },
): StorefrontContent {
	const override = content.policies.shipping.freeShippingThreshold;

	if (override !== null) {
		if (fromSaleor !== null && override !== fromSaleor && process.env.NODE_ENV === "development") {
			console.warn(
				`[content] Channel "${context.channel}": "Free shipping threshold override" on the Storefront — Policies ` +
					`Model (${override}) differs from Saleor's free shipping method for the channel's default country ` +
					`(${fromSaleor}). The storefront advertises the first; checkout applies the second. ` +
					"Clear the override (recommended) or make the two equal.",
			);
		}
		return content;
	}

	if (fromSaleor === null) {
		return content;
	}

	return {
		...content,
		policies: {
			...content.policies,
			shipping: { ...content.policies.shipping, freeShippingThreshold: fromSaleor },
		},
	};
}
