import type { ReadonlyURLSearchParams } from "next/navigation";

/** sessionStorage value is the checkout id currently being completed. */
export const PAYMENT_COMPLETING_STORAGE_KEY = "checkout:payment-completing";

/** Survives PaymentStep unmount during the completing screen (shown on remount). */
export const PAYMENT_COMPLETION_ERROR_STORAGE_KEY = "checkout:payment-completion-error";

const completingListeners = new Set<() => void>();
const paymentActivityResetListeners = new Set<() => void>();

/** Bumped when the shopper aborts via browser Back — in-flight pay work must not re-lock the UI. */
let paymentFlowGeneration = 0;

function notifyPaymentCompletingListeners() {
	for (const listener of completingListeners) {
		listener();
	}
}

function notifyPaymentActivityResetListeners() {
	for (const listener of paymentActivityResetListeners) {
		listener();
	}
}

/** Subscribe to payment-completing flag changes (same-tab sessionStorage updates). */
export function subscribePaymentCompleting(listener: () => void): () => void {
	completingListeners.add(listener);
	return () => {
		completingListeners.delete(listener);
	};
}

/** Subscribe when payment UI should drop busy/overlay state (browser Back, flow abort). */
export function subscribePaymentActivityReset(listener: () => void): () => void {
	paymentActivityResetListeners.add(listener);
	return () => {
		paymentActivityResetListeners.delete(listener);
	};
}

/** Capture at the start of a pay attempt; compare before showing the completing screen. */
export function beginCheckoutPaymentFlow(): number {
	return paymentFlowGeneration;
}

export function isCheckoutPaymentFlowStale(flowGeneration: number): boolean {
	return flowGeneration !== paymentFlowGeneration;
}

/**
 * Exit processing UI after browser Back or an abandoned wallet flow.
 * Optionally stashes a payment-step error and invalidates in-flight pay promises.
 */
export function abortCheckoutPaymentFlow(message?: string) {
	paymentFlowGeneration += 1;
	if (message) {
		stashPaymentCompletionError(message);
	}
	clearPaymentCompleting();
	notifyPaymentActivityResetListeners();
}

export function markPaymentCompleting(checkoutId: string) {
	try {
		sessionStorage.setItem(PAYMENT_COMPLETING_STORAGE_KEY, checkoutId);
	} catch {
		// ignore
	}

	notifyPaymentCompletingListeners();
}

export function clearPaymentCompleting() {
	try {
		sessionStorage.removeItem(PAYMENT_COMPLETING_STORAGE_KEY);
	} catch {
		// ignore
	}

	notifyPaymentCompletingListeners();
}

/** Persist a payment error across the completing-screen transition. */
export function stashPaymentCompletionError(message: string) {
	if (!message) {
		return;
	}

	try {
		sessionStorage.setItem(PAYMENT_COMPLETION_ERROR_STORAGE_KEY, message);
	} catch {
		// ignore
	}
}

/** Read and clear a stashed post-confirm payment error (once per return to payment step). */
export function consumePaymentCompletionError(): string | null {
	try {
		const message = sessionStorage.getItem(PAYMENT_COMPLETION_ERROR_STORAGE_KEY);
		if (message) {
			sessionStorage.removeItem(PAYMENT_COMPLETION_ERROR_STORAGE_KEY);
			return message;
		}
	} catch {
		// ignore
	}

	return null;
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
	if (searchParams && hasProcessingPaymentParam(searchParams)) {
		return true;
	}

	const resolvedCheckoutId = checkoutId ?? (searchParams ? readCheckoutIdFromParams(searchParams) : null);

	return isPaymentCompleting(resolvedCheckoutId);
}
