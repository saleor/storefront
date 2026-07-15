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

/**
 * Shared mutable state lives on `globalThis`, NOT in module scope: dev-mode HMR can keep
 * two live copies of this module in one tab, and module-scoped state would split between
 * them (e.g. Back records intent "shipping" in one copy while the guard reads "payment"
 * from the other and bounces the shopper right back).
 */
type CheckoutQueryGlobalState = {
	historyEventsPatched: boolean;
	intendedStepSlug: string | null;
};

const GLOBAL_STATE_KEY = "__checkoutQueryState" as const;

function getGlobalState(): CheckoutQueryGlobalState {
	const holder = globalThis as typeof globalThis & {
		[GLOBAL_STATE_KEY]?: CheckoutQueryGlobalState;
	};
	holder[GLOBAL_STATE_KEY] ??= { historyEventsPatched: false, intendedStepSlug: null };
	return holder[GLOBAL_STATE_KEY];
}

/**
 * Next's router restores its canonical URL with a plain `history.replaceState` (no event)
 * after server-action revalidation — silently clobbering shallow `?step=` writes. Wrap the
 * history methods once so EVERY URL write (ours or the router's) notifies live-URL
 * subscribers; without this, `CheckoutStepUrlGuard` cannot see the clobber it must heal.
 *
 * The dispatch is deferred to a microtask: the App Router commits URL updates inside
 * `useInsertionEffect`, where scheduling React updates is illegal ("useInsertionEffect
 * must not schedule updates") and the guard's healing update would be dropped.
 */
function installHistoryEventsPatch(): void {
	if (typeof window === "undefined") {
		return;
	}
	const state = getGlobalState();
	if (state.historyEventsPatched) {
		return;
	}
	state.historyEventsPatched = true;

	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);

	const notifyAfterCommit = () => {
		queueMicrotask(() => {
			window.dispatchEvent(new Event(CHECKOUT_QUERY_CHANGE));
		});
	};

	window.history.pushState = (...args: Parameters<History["pushState"]>) => {
		originalPushState(...args);
		notifyAfterCommit();
	};
	window.history.replaceState = (...args: Parameters<History["replaceState"]>) => {
		originalReplaceState(...args);
		notifyAfterCommit();
	};
}

function subscribeToCheckoutQuery(onStoreChange: () => void): () => void {
	installHistoryEventsPatch();
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
	// Pushing the current URL again would create back-to-back duplicate history entries
	// (e.g. a double-fired Continue) — downgrade to replace.
	const isSameUrl = window.location.pathname + window.location.search === url;

	if (history === "push" && !isSameUrl) {
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

	if ("step" in updates) {
		recordCheckoutStepIntent(updates.step ?? null);
	}

	const url = buildCheckoutQueryUrl(window.location.search, updates, pathname);
	writeCheckoutQueryHistory(url, history);
}

// ---------------------------------------------------------------------------
// Step intent — the shopper's current step as expressed by their own actions
// (Continue/Back buttons, stepper clicks, browser Back/Forward, deep links).
// Global state resets per page load, matching the shallow-URL lifetime.
// ---------------------------------------------------------------------------

/** Record which step the shopper intends to be on (`null` clears intent). */
export function recordCheckoutStepIntent(slug: string | null): void {
	getGlobalState().intendedStepSlug = slug;
}

export function getCheckoutStepIntent(): string | null {
	return getGlobalState().intendedStepSlug;
}

/**
 * Reactive step intent — re-renders on the same events as the live URL (every history
 * write and popstate; intent only changes alongside those). Step UI must render from
 * intent, not the raw URL: a server-action revalidation can flash a stale `?step=` into
 * the URL bar before the guard heals it, and URL-driven UI would remount the payment
 * step (re-initializing Stripe and firing new actions whose revalidations sustain the
 * loop).
 */
export function useCheckoutStepIntent(): string | null {
	return useSyncExternalStore(subscribeToCheckoutQuery, getCheckoutStepIntent, () => null);
}

/**
 * Returns the step slug to re-assert when a history write (typically the router restoring
 * its canonical URL after server-action revalidation) dropped or changed the intended
 * `?step=`. Returns `null` when the URL already matches or there is no intent.
 */
export function resolveStepReassertion(liveSearch: string, intendedStep: string | null): string | null {
	if (!intendedStep) {
		return null;
	}

	const params = new URLSearchParams(normalizeSearchString(liveSearch));
	return params.get("step") === intendedStep ? null : intendedStep;
}

type RouterReplace = (href: string, options?: { scroll?: boolean }) => void;

/**
 * Next's `useSearchParams()` lags shallow `updateCheckoutQuery` writes. Server actions POST
 * against the router snapshot and `X-Action-Revalidated` refreshes back to it — which drops
 * `?step=payment` and lands on Contact. Compare against the live URL bar, not React params.
 *
 * Intent gate: never propagate a live URL whose `?step=` contradicts the shopper's recorded
 * step intent. A revalidation clobber can flash a stale step into the URL bar; syncing the
 * router to it would turn the transient clobber into a real navigation that fights the
 * guard's heal (payment ⇄ shipping loop, Stripe remounting on every bounce).
 */
export function getCheckoutRouterSyncHref(routerSearch: string): string | null {
	if (typeof window === "undefined") {
		return null;
	}

	const live = getLiveSearchString();
	const routerNorm = normalizeSearchString(routerSearch);

	if (live === routerNorm) {
		return null;
	}

	const intent = getCheckoutStepIntent();
	if (intent && new URLSearchParams(live).get("step") !== intent) {
		return null;
	}

	return live ? `?${live}` : window.location.pathname;
}

/** Align the App Router search snapshot with the live checkout URL bar. */
export function syncCheckoutRouterWithLiveUrl(
	router: { replace: RouterReplace },
	routerSearch: string,
): boolean {
	const href = getCheckoutRouterSyncHref(routerSearch);
	if (!href) {
		return false;
	}

	router.replace(href, { scroll: false });
	return true;
}
