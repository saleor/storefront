"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Storefront scroll orchestration for the App Router.
 *
 * Two behaviours:
 * - **Forward nav** (new pathname): scroll to the true document top (y=0). Next's layout-router
 *   only scrolls the changed *segment* into view and skips sticky chrome (`shouldSkipElement`),
 *   so pages otherwise land one `--chrome-offset` below the top — tucking the breadcrumbs under
 *   the header. We override that so the announcement bar + breadcrumbs are visible.
 * - **Back / forward** (popstate): restore the destination's saved scroll offset.
 *
 * ## Re-assert through streamed commits (`settleScroll`)
 * Browse pages render behind a `Suspense` skeleton, so at the navigation commit the document is
 * too short to hold the target offset and Next runs its segment scroll on the *later* skeleton →
 * content commit. A single `scrollTo` therefore loses. Both directions apply their target, then
 * re-assert it on each `<main>` mutation (and once on the next frame, for instant cache-hit navs
 * that render on the same commit) until it sticks or a short window closes. Forward re-assertion
 * bails once the user scrolls past the tuck range (never yank them); restoration stops once the
 * grown document can honour the saved offset.
 *
 * ## Why restoration lives in the popstate handler, not the layout effect
 * This Next build registers its own `popstate` listener before ours and commits the destination
 * route *synchronously* inside it, so our component's `useLayoutEffect` runs (and would treat
 * Back as a forward nav) **before** our `popstate` handler gets to flip a flag. A `popPending`
 * flag read in the effect is therefore always stale on Back. Instead the handler runs after that
 * commit — when the destination DOM exists — and restores the saved offset directly, cancelling
 * the forward reset the effect just started (`activeSettle`). A `popPending` hint is still set so
 * builds that commit *after* popstate restore via the effect's branch.
 *
 * ## Why state lives at module scope
 * In dev, `usePathname()` suspends this component mid-navigation, so React may tear down and
 * recreate the fiber across the Suspense boundary — a `useRef` cannot survive a navigation.
 * Navigation state, saved offsets, and listeners therefore live at module scope (installed once).
 *
 * ## Persistence
 * `scrollRestoration` is set to `manual` (the browser's `auto` flashes the destination offset
 * onto the still-painted outgoing page). Offsets are saved per `pathname + search` on scroll
 * (rAF-coalesced) and flushed on `pagehide` / tab hide, in a bounded LRU map.
 *
 * | Flow | Expected |
 * |------|----------|
 * | PLP scroll → PDP → Back | PLP restored to saved offset |
 * | Forward route change | Document top (breadcrumbs visible) |
 * | PLP filter / PDP variant (`scroll: false`) | Scroll preserved |
 * | Back/forward with `#anchor` | Browser hash target wins |
 */

// How long after a nav to keep correcting as streamed content commits.
const REASSERT_WINDOW_MS = 1500;
// Forward-nav guard: only correct within the "tucked under header" range (chrome-offset is
// ~104px); past this the user has scrolled intentionally and must not be yanked back.
const REASSERT_GUARD_PX = 200;
// Bounded LRU of saved offsets — enough for deep browse sessions without unbounded growth.
const MAX_SCROLL_ENTRIES = 50;

// Module-scope state — survives dev's Suspense-induced unmount/remount (see header).
const scrollPositions = new Map<string, number>();
let lastPathname: string | null = null;
let popPending = false;
let didInit = false;
let listenersInstalled = false;
// Teardown of the in-flight re-assertion, so a later settle (e.g. Back restoration overriding
// the forward reset the layout effect just started) can cancel the earlier one.
let activeSettle: (() => void) | null = null;

function getScrollKey(): string {
	return window.location.pathname + window.location.search;
}

function rememberScrollPosition(key: string, y: number): void {
	// Re-insert to refresh LRU recency.
	scrollPositions.delete(key);
	scrollPositions.set(key, y);
	while (scrollPositions.size > MAX_SCROLL_ENTRIES) {
		const oldest = scrollPositions.keys().next().value;
		if (oldest == null) break;
		scrollPositions.delete(oldest);
	}
}

/**
 * Apply `targetY` now, then re-assert it across the streamed-content commits that follow this
 * navigation. Cancels any previous in-flight settle. See header for the rationale.
 */
function runSettle(targetY: number, isRestore: boolean): void {
	activeSettle?.();

	const apply = () => window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
	apply();

	let done = false;
	let raf: number | undefined;
	let timeout: number | undefined;
	let observer: MutationObserver | undefined;

	const stop = () => {
		if (done) return;
		done = true;
		if (raf !== undefined) cancelAnimationFrame(raf);
		if (timeout !== undefined) window.clearTimeout(timeout);
		observer?.disconnect();
		if (activeSettle === stop) activeSettle = null;
	};

	const reassert = () => {
		if (done) return;
		// An in-page #hash target always wins.
		if (window.location.hash) return stop();
		// Forward: the user scrolled out of the tuck range — they meant it, stop correcting.
		if (!isRestore && window.scrollY > REASSERT_GUARD_PX) return stop();
		apply();
		// Restore: once the grown document can honour the saved offset, we're done.
		if (isRestore && window.scrollY >= targetY) return stop();
	};

	// Instant cache-hit nav renders on this same commit, so Next's segment scroll runs after the
	// apply above with no `<main>` mutation to catch — re-assert once the layout effects flush.
	raf = requestAnimationFrame(reassert);

	// Streamed pages: each skeleton → content mutation grows the document; re-assert on each.
	const main = document.querySelector("main");
	if (main) {
		observer = new MutationObserver(reassert);
		observer.observe(main, { childList: true, subtree: true });
	}

	timeout = window.setTimeout(stop, REASSERT_WINDOW_MS);
	activeSettle = stop;
}

function restoreForPop(): void {
	if (window.location.hash) return;
	runSettle(scrollPositions.get(getScrollKey()) ?? 0, true);
}

function installListeners(): void {
	if (listenersInstalled || typeof window === "undefined") return;
	listenersInstalled = true;

	if ("scrollRestoration" in history) {
		history.scrollRestoration = "manual";
	}

	let scrollRaf: number | null = null;
	window.addEventListener(
		"scroll",
		() => {
			if (scrollRaf != null) return;
			scrollRaf = requestAnimationFrame(() => {
				scrollRaf = null;
				rememberScrollPosition(getScrollKey(), window.scrollY);
			});
		},
		{ passive: true },
	);

	window.addEventListener("popstate", () => {
		// Next commits the destination route synchronously *before* this listener in the observed
		// build, so the layout effect has already run a forward reset — override it now. Also set
		// the hint for builds that commit *after* popstate (handled in the effect's restore branch).
		popPending = true;
		restoreForPop();
		// Clear the hint if no post-popstate commit consumes it (the sync-commit case).
		setTimeout(() => {
			popPending = false;
		}, 0);
	});

	const flush = () => rememberScrollPosition(getScrollKey(), window.scrollY);
	window.addEventListener("pagehide", flush);
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") flush();
	});
}

export function ScrollToTopOnNavigate() {
	const pathname = usePathname();

	useEffect(() => {
		installListeners();
	}, []);

	useLayoutEffect(() => {
		// First commit (hydration): record the starting position, don't fight first paint.
		if (!didInit) {
			didInit = true;
			lastPathname = pathname;
			return;
		}

		const pathnameChanged = lastPathname !== pathname;
		lastPathname = pathname;

		// Query-only forward push (`router.push(..., { scroll: false })` — PLP filters, PDP
		// variants): preserve scroll. (Query-only pops are handled by the popstate handler.)
		if (!pathnameChanged) return;

		// Back / forward where the commit lands *after* popstate: restore here. (When the commit
		// lands before popstate — the common case — the popstate handler does the restore.)
		if (popPending) {
			popPending = false;
			return restoreForPop();
		}

		// Forward to an in-page anchor: let the browser/Next handle the hash target.
		if (window.location.hash) return;

		runSettle(0, false);
	}, [pathname]);

	return null;
}
