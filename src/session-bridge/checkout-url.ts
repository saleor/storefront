export type BuildCheckoutPathOptions = {
	checkoutId: string;
	step?: string;
	/** Browse locale slug from `/{locale}/{channel}/…` — synced to checkout via `?locale=`. */
	browseLocale?: string;
};

export type BuildOrderConfirmationPathOptions = {
	/** Signed guest-order token (`ov1.…`), or a Saleor order id for the email landing. */
	token: string;
	/** Browse locale slug — `/order` is locale-less, so confirmation must carry `?locale=`. */
	browseLocale?: string | null;
};

/** Query keys as they appear in the browser URL (not internal mapped names). */
const urlQueryKeys = {
	checkout: "checkout",
	order: "order",
	step: "step",
	locale: "locale",
} as const;

/** Locale-less guest / confirmation order page. */
export function buildOrderStatusPath(key: string, browseLocale?: string | null): string {
	const path = `/order/${encodeURIComponent(key)}`;
	if (!browseLocale) {
		return path;
	}
	return `${path}?${urlQueryKeys.locale}=${encodeURIComponent(browseLocale)}`;
}

/**
 * Relative checkout path (same-origin Paper deploy).
 */
export function buildCheckoutPath({ checkoutId, step, browseLocale }: BuildCheckoutPathOptions): string {
	const params = new URLSearchParams();
	params.set(urlQueryKeys.checkout, checkoutId);

	if (step) {
		params.set(urlQueryKeys.step, step);
	}

	if (browseLocale) {
		params.set(urlQueryKeys.locale, browseLocale);
	}

	return `/checkout?${params.toString()}`;
}

/**
 * Post-pay and email order page (`/order/{token}`).
 */
export function buildOrderConfirmationPath({
	token,
	browseLocale,
}: BuildOrderConfirmationPathOptions): string {
	return buildOrderStatusPath(token, browseLocale);
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

/**
 * Absolute or relative order confirmation URL.
 */
export function buildOrderConfirmationUrl(options: BuildOrderConfirmationPathOptions): string {
	const path = buildOrderConfirmationPath(options);
	const origin = getCheckoutOrigin();

	if (!origin) {
		return path;
	}

	return `${origin}${path}`;
}
