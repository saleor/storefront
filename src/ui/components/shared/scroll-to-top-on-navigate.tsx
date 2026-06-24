"use client";

import { useEffect, useRef } from "react";
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
 * This resets scroll to the top on every pathname change, while deliberately:
 * - skipping the initial mount (don't fight first paint / SSR position),
 * - skipping back/forward navigations (let the browser restore the prior scroll position),
 * - skipping when the URL targets an in-page anchor (`#hash`).
 *
 * Back/forward is detected with a plain boolean `popstate` flag rather than a time window
 * on purpose: a timer could misfire on a slow render and scroll-to-top on a Back press,
 * which is the one behaviour we must never break. The flag's only cost is that a `popstate`
 * that does NOT change the pathname (e.g. hash/query-only Back) can leave it set, so the
 * next forward push skips its reset once — a harmless, self-correcting degradation.
 */
export function ScrollToTopOnNavigate() {
	const pathname = usePathname();
	const isInitialRender = useRef(true);
	const isPopNavigation = useRef(false);

	useEffect(() => {
		const handlePopState = () => {
			isPopNavigation.current = true;
		};
		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	useEffect(() => {
		if (isInitialRender.current) {
			isInitialRender.current = false;
			return;
		}

		// Back/forward: respect the browser's restored scroll position.
		if (isPopNavigation.current) {
			isPopNavigation.current = false;
			return;
		}

		// Anchor link within the page: let the hash drive the scroll target.
		if (window.location.hash) {
			return;
		}

		window.scrollTo({ top: 0, left: 0, behavior: "instant" });
	}, [pathname]);

	return null;
}
