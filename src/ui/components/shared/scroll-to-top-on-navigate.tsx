"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
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
 * Back/forward is detected with a plain boolean `popstate` flag rather than a time window
 * on purpose: a timer could misfire on a slow render and scroll-to-top on a Back press,
 * which is the one behaviour we must never break. The flag's only cost is that a `popstate`
 * that does NOT change the pathname (e.g. hash/query-only Back) can leave it set, so the
 * next forward push skips its reset once — a harmless, self-correcting degradation.
 *
 * Pathname-only dependency intentionally ignores query-only `router.push(..., { scroll: false })`
 * (PLP filters, PDP variant params) so scroll position is preserved.
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

	useLayoutEffect(() => {
		if (isInitialRender.current) {
			isInitialRender.current = false;
			return;
		}

		if (isPopNavigation.current) {
			isPopNavigation.current = false;
			return;
		}

		if (window.location.hash) {
			return;
		}

		window.scrollTo({ top: 0, left: 0, behavior: "instant" });
	}, [pathname]);

	return null;
}
