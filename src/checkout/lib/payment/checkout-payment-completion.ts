import type { ReadonlyURLSearchParams } from "next/navigation";

/** sessionStorage value is the checkout id currently being completed. */
export const PAYMENT_COMPLETING_STORAGE_KEY = "checkout:payment-completing";

/**
 * Interruption copy is tiered by how far the money got — "try again" is only safe
 * while nothing has been authorized at the PSP.
 */

/** Aborted before transactionInitialize / confirmPayment — no charge exists anywhere. */
export const PAYMENT_INTERRUPTED_MESSAGE =
	"Payment was interrupted before you were charged. You can safely try again.";

/** Aborted after the PSP authorized — retrying would create a second authorization. */
export const PAYMENT_AUTHORIZED_INTERRUPTED_MESSAGE =
	"Your payment went through, but your order has not been placed yet. Do not pay again — use “Complete order” below to finish.";

/** Aborted during the completing screen — order placement continues in the background. */
export const ORDER_FINALIZING_INTERRUPTED_MESSAGE =
	"Your order is still being placed. Do not pay again — this page will update once it finishes.";

/** An interrupted attempt could not be verified against Saleor — block retry guidance. */
export const PAYMENT_VERIFICATION_UNAVAILABLE_MESSAGE =
	"We could not verify your previous payment attempt. Please refresh the page — do not pay again until it is verified.";

/** Survives PaymentStep unmount during the completing screen (shown on remount). */
export const PAYMENT_COMPLETION_ERROR_STORAGE_KEY = "checkout:payment-completion-error";

const completingListeners = new Set<() => void>();
const paymentActivityResetListeners = new Set<() => void>();

/** Bumped when the shopper aborts via browser Back — in-flight pay work must not re-lock the UI. */
let paymentFlowGeneration = 0;

/**
 * True while the completing flag was set by THIS page load (its async pipeline is alive).
 * Module state resets on reload — a sessionStorage flag without ownership means the
 * process/finalize pipeline died with the previous page and must be resumed.
 */
let completingOwnedByThisPageLoad = false;

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

	completingOwnedByThisPageLoad = true;
	notifyPaymentCompletingListeners();
}

export function clearPaymentCompleting() {
	try {
		sessionStorage.removeItem(PAYMENT_COMPLETING_STORAGE_KEY);
	} catch {
		// ignore
	}

	completingOwnedByThisPageLoad = false;
	notifyPaymentCompletingListeners();
}

/**
 * Completing flag that survived a reload: the previous page's process/finalize
 * pipeline is dead and nobody will clear the flag — the resume flow must take over.
 */
export function isPaymentCompletingOrphaned(checkoutId: string | null): boolean {
	if (completingOwnedByThisPageLoad) {
		return false;
	}

	return isPaymentCompleting(checkoutId);
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
