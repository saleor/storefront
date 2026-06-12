import { useMemo, useSyncExternalStore } from "react";
import { type ReadonlyURLSearchParams } from "next/navigation";

import { createQueryString } from "@/session-bridge/search-params";

/** Fired after shallow history updates so subscribers see the new query. */
export const CHECKOUT_QUERY_CHANGE = "checkout:query-change";

export type CheckoutQueryUpdate = Record<string, string | null>;

export type CheckoutQueryHistory = "push" | "replace";

export type UpdateCheckoutQueryOptions = {
	/** `shallow` (default) avoids re-running the checkout RSC page on step-only changes. */
	mode?: "shallow" | "navigate";
	pathname?: string;
	/**
	 * `replace` (default) overwrites the current entry — use for stepper jumps and Stripe cleanup.
	 * `push` adds a history entry — use when advancing via Continue so browser Back walks steps.
	 */
	history?: CheckoutQueryHistory;
};

function normalizeSearchString(search: string): string {
	if (!search) {
		return "";
	}

	return search.startsWith("?") ? search.slice(1) : search;
}

function subscribeToCheckoutQuery(onStoreChange: () => void): () => void {
	window.addEventListener("popstate", onStoreChange);
	window.addEventListener(CHECKOUT_QUERY_CHANGE, onStoreChange);

	return () => {
		window.removeEventListener("popstate", onStoreChange);
		window.removeEventListener(CHECKOUT_QUERY_CHANGE, onStoreChange);
	};
}

function getLiveSearchString(): string {
	return normalizeSearchString(window.location.search);
}

/**
 * Live checkout query string, including shallow history updates that Next's
 * `useSearchParams()` does not reflect until a full navigation.
 */
export function useLiveCheckoutSearchString(serverFallback: string): string {
	return useSyncExternalStore(subscribeToCheckoutQuery, getLiveSearchString, () =>
		normalizeSearchString(serverFallback),
	);
}

/** Live checkout query params — includes shallow history updates. */
export function useLiveCheckoutSearchParams(serverSearchParams: ReadonlyURLSearchParams): URLSearchParams {
	const searchString = useLiveCheckoutSearchString(serverSearchParams.toString());

	return useMemo(() => new URLSearchParams(searchString), [searchString]);
}

/**
 * Build the next checkout URL from the live query string and internal param updates.
 * Exported for unit tests — browser entry point is `updateCheckoutQuery`.
 */
export function buildCheckoutQueryUrl(
	liveSearch: string,
	updates: CheckoutQueryUpdate,
	pathname: string,
): string {
	const liveParams = new URLSearchParams(liveSearch);
	const query = createQueryString(liveParams as ReadonlyURLSearchParams, updates);

	return query ? `${pathname}?${query}` : pathname;
}

/**
 * Update checkout URL query params, merging into the live URL bar so ephemeral params
 * (Stripe `payment_intent`, `processingPayment`, etc.) are never dropped.
 *
 * Step changes use shallow mode intentionally — same pattern as legacy Pages Router
 * `shallow: true`, which App Router does not expose for search-only updates.
 */
export function writeCheckoutQueryHistory(url: string, history: CheckoutQueryHistory = "replace"): void {
	const state = window.history.state;

	if (history === "push") {
		window.history.pushState(state, "", url);
	} else {
		window.history.replaceState(state, "", url);
	}

	window.dispatchEvent(new Event(CHECKOUT_QUERY_CHANGE));
}

export function updateCheckoutQuery(
	updates: CheckoutQueryUpdate,
	options: UpdateCheckoutQueryOptions = {},
): void {
	const { mode = "shallow", pathname = window.location.pathname, history = "replace" } = options;

	if (mode === "navigate") {
		throw new Error(
			"updateCheckoutQuery navigate mode is not implemented — use router.replace for full navigations",
		);
	}

	const url = buildCheckoutQueryUrl(window.location.search, updates, pathname);
	writeCheckoutQueryHistory(url, history);
}
