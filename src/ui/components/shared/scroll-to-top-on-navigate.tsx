"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Forces the window to the true document top (y=0) on forward storefront navigation.
 *
 * Next's App Router does not call `window.scrollTo(0, 0)` on navigation — it scrolls the
 * changed *page segment* into view and explicitly skips sticky/fixed chrome (see
 * `shouldSkipElement` in next's `layout-router`). Because the announcement bar + sticky
 * header sit above `<main>` in document flow, "the top of the page content" is one
 * chrome-height (`--chrome-offset`) below y=0, so navigations land tucked under the header
 * with the announcement bar scrolled away instead of at the real top.
 *
 * Resets scroll on pathname changes only, while deliberately:
 * - skipping the initial mount (don't fight first paint / SSR position),
 * - skipping back/forward navigations (let the browser restore scroll),
 * - skipping when the URL targets an in-page anchor (`#hash`).
 *
 * ## Late re-assertion for streamed pages
 * PDP (and PLP) wrap their content in `<Suspense>` with a skeleton fallback while cached
 * data loads. Our reset fires on the layout commit (pathname change), but the real page
 * content streams in on a *later* commit — and Next's `InnerScrollHandlerNew` runs its
 * segment scroll on that late commit, overriding our reset and tucking the page one
 * `--chrome-offset` under the header. So after the immediate reset we also re-assert y=0
 * on the **first** `<main>` mutation after navigation (the skeleton → real-content swap).
 *
 * Re-asserting once is enough because Next consumes `scrollRef` on that single late commit;
 * re-asserting on *every* mutation would yank the user back to y=0 mid-interaction (opening
 * the variant accordion, swiping the gallery) within the window. The re-assert bails if
 * `scrollY` is already past the tuck range — the user scrolled intentionally during the
 * skeleton phase and we must not yank them back.
 *
 * ## Same-commit re-assertion for instant (client-cached) navigation
 * When the destination's data is already in the client router cache (instant soft nav — the
 * common case once per-nav `router.refresh()` was removed), the page renders on the *same*
 * commit as the pathname change with **no** skeleton → content swap. This component's layout
 * effect runs before the page segment's, so Next's `InnerScrollHandlerNew` tucks the content
 * one `--chrome-offset` under the sticky header *after* our immediate `reset()` — and there's
 * no `<main>` mutation for the observer to catch. So we also re-assert once on the next
 * animation frame (after the commit's layout effects flush, hence after Next's segment scroll),
 * guarded by the same tuck range so it never fights a real user scroll.
 *
 * ## Why navigation state lives at module scope
 * In dev, `usePathname()` calls `use(navigationPromises.pathname)` (see next's
 * `navigation.js`), which *suspends* this component mid-navigation. React may tear down
 * and recreate the fiber across that Suspense boundary, so a `useRef` holding "is this the
 * first render?" or "was the last nav a popstate?" cannot be trusted to survive a
 * navigation — after a Back, the recreated fiber would read a stale/ref-reset value and
 * silently skip the next forward reset (the "first click works, second after Back doesn't"
 * failure). `lastPathname` / `popPending` / `didInit` live at module scope and the
 * `popstate` listener is installed once globally, so forward/back detection is stable
 * across Suspense unmount/remount.
 *
 * `popPending` is a plain boolean rather than a time window on purpose: a timer could
 * misfire on a slow render and scroll-to-top on a Back press, which is the one behaviour
 * we must never break. Its only cost is that a `popstate` that does NOT change the
 * pathname (e.g. hash/query-only Back) can leave it set, so the next forward push skips
 * its reset once — a harmless, self-correcting degradation.
 *
 * Pathname-only dependency intentionally ignores query-only `router.push(..., { scroll: false })`
 * (PLP filters, PDP variant params) so scroll position is preserved.
 */

// Re-assert window position past the "tucked under header" range only. `--chrome-offset`
// is header + announcement bar (~64–104px); 200px cleanly covers it while protecting any
// real user scroll that has moved meaningfully into the page.
const REASSERT_GUARD_PX = 200;
// How long after a forward nav to keep waiting for the streamed content swap before giving
// up. Covers the skeleton → real-content commit for cached/streamed pages without lingering.
const REASSERT_WINDOW_MS = 1500;

// Module-level navigation state — see file header for why this can't live in refs.
let lastPathname: string | null = null;
let popPending = false;
let didInit = false;
let popstateInstalled = false;

function installPopstateListener(): void {
	if (popstateInstalled || typeof window === "undefined") return;
	popstateInstalled = true;
	window.addEventListener("popstate", () => {
		popPending = true;
	});
}

export function ScrollToTopOnNavigate() {
	const pathname = usePathname();

	// Install once globally — idempotent, never removed (see header). In an effect rather than
	// in render so the side effect runs post-commit, and the listener persists across the
	// Suspense-induced unmount/remounts below because we return no cleanup.
	useEffect(() => {
		installPopstateListener();
	}, []);

	useLayoutEffect(() => {
		// First ever commit (hydration): record the starting pathname, don't fight SSR position.
		if (!didInit) {
			didInit = true;
			lastPathname = pathname;
			return;
		}

		// Query/hash-only push (`router.push(..., { scroll: false })`): preserve scroll.
		if (lastPathname === pathname) return;
		lastPathname = pathname;

		// Back/forward: let the browser restore scroll position.
		if (popPending) {
			popPending = false;
			return;
		}

		// In-page anchor: let the browser/Next handle the hash target.
		if (window.location.hash) return;

		const reset = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
		reset();

		// Re-assert y=0 only within the "tucked under header" range; never yank a user who
		// scrolled meaningfully into the page, and never override an in-page `#hash` target.
		// Returns whether it actually re-asserted, so the observer knows when to stop.
		const reassertIfTucked = (): boolean => {
			if (window.location.hash) return false;
			if (window.scrollY > REASSERT_GUARD_PX) return false;
			reset();
			return true;
		};

		// Instant (client-cached) nav: the page renders on this same commit, so Next's segment
		// scroll tucks it *after* the reset above with no `<main>` mutation to catch. Re-assert
		// after the commit's layout effects flush (next frame). Harmless for streamed pages —
		// the skeleton is still showing at y=0, so this is a no-op and the observer takes over.
		const raf = requestAnimationFrame(() => {
			reassertIfTucked();
		});

		// Re-assert once on the first streamed-content swap (see header). The outer `<main>`
		// from main-chrome hosts the swapping page segment, so a childList/subtree mutation
		// catches the skeleton → real-content commit that triggers Next's late segment scroll.
		const main = document.querySelector("main");
		if (!main) {
			return () => cancelAnimationFrame(raf);
		}

		let reasserted = false;
		let timeout: number | undefined;
		const observer = new MutationObserver(() => {
			if (reasserted) return;
			if (!reassertIfTucked()) return;
			reasserted = true;
			observer.disconnect();
			if (timeout !== undefined) window.clearTimeout(timeout);
		});
		observer.observe(main, { childList: true, subtree: true });

		timeout = window.setTimeout(() => observer.disconnect(), REASSERT_WINDOW_MS);

		return () => {
			cancelAnimationFrame(raf);
			observer.disconnect();
			if (timeout !== undefined) window.clearTimeout(timeout);
		};
	}, [pathname]);

	return null;
}
