export type BuildCheckoutPathOptions = {
	checkoutId: string;
	step?: string;
	orderId?: string;
};

/** Query keys as they appear in the browser URL (not internal mapped names). */
const urlQueryKeys = {
	checkout: "checkout",
	order: "order",
	step: "step",
} as const;

/**
 * Relative checkout path (same-origin Paper deploy).
 */
export function buildCheckoutPath({ checkoutId, step, orderId }: BuildCheckoutPathOptions): string {
	const params = new URLSearchParams();

	if (orderId) {
		params.set(urlQueryKeys.order, orderId);
	} else {
		params.set(urlQueryKeys.checkout, checkoutId);
	}

	if (step) {
		params.set(urlQueryKeys.step, step);
	}

	return `/checkout?${params.toString()}`;
}

/**
 * Origin for checkout links. Empty NEXT_PUBLIC_CHECKOUT_URL → same deploy (relative paths).
 */
export function getCheckoutOrigin(): string | undefined {
	const configured = process.env.NEXT_PUBLIC_CHECKOUT_URL?.replace(/\/$/, "");
	return configured || undefined;
}

/**
 * Absolute or relative checkout URL for cart → checkout handoff.
 */
export function buildCheckoutUrl(options: BuildCheckoutPathOptions): string {
	const path = buildCheckoutPath(options);
	const origin = getCheckoutOrigin();

	if (!origin) {
		return path;
	}

	return `${origin}${path}`;
}
