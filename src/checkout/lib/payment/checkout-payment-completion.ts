import type { ReadonlyURLSearchParams } from "next/navigation";

/** sessionStorage value is the checkout id currently being completed. */
export const PAYMENT_COMPLETING_STORAGE_KEY = "checkout:payment-completing";

export function markPaymentCompleting(checkoutId: string) {
	try {
		sessionStorage.setItem(PAYMENT_COMPLETING_STORAGE_KEY, checkoutId);
	} catch {
		// ignore
	}
}

export function clearPaymentCompleting() {
	try {
		sessionStorage.removeItem(PAYMENT_COMPLETING_STORAGE_KEY);
	} catch {
		// ignore
	}
}

/** True only when the stored checkout id matches the active checkout session. */
export function isPaymentCompleting(forCheckoutId?: string | null): boolean {
	try {
		const stored = sessionStorage.getItem(PAYMENT_COMPLETING_STORAGE_KEY);
		if (!stored) {
			return false;
		}

		if (!forCheckoutId || stored !== forCheckoutId) {
			clearPaymentCompleting();
			return false;
		}

		return true;
	} catch {
		return false;
	}
}

type SearchParamsLike = URLSearchParams | ReadonlyURLSearchParams;

function hasProcessingPaymentParam(params: SearchParamsLike): boolean {
	return params.get("processingPayment") === "true";
}

function readCheckoutIdFromParams(params: SearchParamsLike): string | null {
	const checkoutId = params.get("checkout");
	return checkoutId || null;
}

/** True while payment authorize/complete is running for this checkout. */
export function isCheckoutPaymentActive(
	searchParams?: SearchParamsLike | null,
	checkoutId?: string | null,
): boolean {
	const resolvedCheckoutId = checkoutId ?? (searchParams ? readCheckoutIdFromParams(searchParams) : null);

	if (isPaymentCompleting(resolvedCheckoutId)) {
		return true;
	}

	if (searchParams && hasProcessingPaymentParam(searchParams)) {
		return true;
	}

	if (typeof window !== "undefined") {
		const liveParams = new URLSearchParams(window.location.search);
		if (hasProcessingPaymentParam(liveParams)) {
			return true;
		}
	}

	return false;
}
