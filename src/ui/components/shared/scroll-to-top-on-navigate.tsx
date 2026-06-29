"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Max history entries kept per tab — enough for deep browse sessions without unbounded growth. */
const MAX_SCROLL_ENTRIES = 50;

/**
 * Scroll offsets keyed by `pathname + search` (matches `window.location`).
 * Map iteration order is used as a simple LRU: re-`set` on access refreshes an entry.
 */
const scrollPositions = new Map<string, number>();

function getScrollKey(): string {
	return window.location.pathname + window.location.search;
}

function rememberScrollPosition(key: string, y: number): void {
	if (scrollPositions.has(key)) {
		scrollPositions.delete(key);
	}
	scrollPositions.set(key, y);
	while (scrollPositions.size > MAX_SCROLL_ENTRIES) {
		const oldest = scrollPositions.keys().next().value;
		if (oldest != null) {
			scrollPositions.delete(oldest);
		}
	}
}

function scrollToTop(): void {
	window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

/**
 * Scroll to a hash target when the URL carries `#fragment`.
 * Mirrors browser behavior for id and name anchors.
 */
function scrollToHashIfPresent(): boolean {
	const raw = window.location.hash;
	if (!raw || raw === "#") return false;

	const fragment = raw.slice(1);
	const target =
		document.getElementById(fragment) ?? (document.getElementsByName(fragment)[0] as Element | undefined);

	if (!(target instanceof HTMLElement)) {
		return false;
	}

	target.scrollIntoView({ behavior: "instant", block: "start" });
	return true;
}

function restoreSavedScrollPosition(): void {
	if (scrollToHashIfPresent()) return;

	const savedY = scrollPositions.get(getScrollKey());
	if (savedY != null && savedY > 0) {
		window.scrollTo({ top: savedY, left: 0, behavior: "instant" });
	}
}

function isModifiedClick(event: MouseEvent): boolean {
	return (
		event.defaultPrevented ||
		event.button !== 0 ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey
	);
}

function isInternalNavigationAnchor(anchor: HTMLAnchorElement): boolean {
	if (!anchor.href || anchor.target === "_blank" || anchor.hasAttribute("download")) {
		return false;
	}

	const url = new URL(anchor.href);
	if (url.origin !== window.location.origin) return false;

	return !(url.pathname === window.location.pathname && url.search === window.location.search);
}

/**
 * Storefront scroll orchestration for the App Router.
 *
 * ## Forward navigation
 * Next's layout-router scrolls the changed *segment* into view and skips sticky chrome
 * (`shouldSkipElement`), so new pages land one `--chrome-offset` below y=0. We reset to
 * the true document top on **pathname** changes only.
 *
 * Query-only updates (`router.push(..., { scroll: false })` — PLP filters, PDP variants)
 * intentionally preserve scroll and must not trigger a reset.
 *
 * ## Back / forward
 * Browser `scrollRestoration: auto` applies the *destination* history entry's offset while
 * the *outgoing* page is still painted (PLP offset visibly applied to PDP before the swap).
 * We take ownership (`manual`), pin to top synchronously on `popstate`, then restore the
 * saved offset in `useLayoutEffect` once React commits the destination route.
 *
 * ## Persistence
 * - rAF-coalesced scroll writes (one Map update per frame)
 * - Flush on internal link click, `pagehide`, and `visibilitychange: hidden`
 * - Bounded LRU cache (50 entries)
 *
 * ## Lifecycle
 * Sets `history.scrollRestoration = 'manual'` while mounted; restores the prior value on
 * unmount so other surfaces (e.g. checkout) are not affected after leaving browse chrome.
 *
 * ### Manual QA matrix
 * | Flow | Expected |
 * |------|----------|
 * | PLP scroll → PDP → Back | PLP at saved offset; no PDP scroll flash |
 * | PLP filter / sort toggle | Scroll preserved |
 * | PDP variant change | Scroll preserved |
 * | PLP (filtered) → PDP → Back | Filtered PLP offset restored |
 * | Forward route change | Document top (y=0) |
 * | Back/forward with `#anchor` | Section scrolled into view |
 * | Locale / channel switch (`router.push`) | Prior page offset saved via scroll flush |
 */
export function ScrollToTopOnNavigate() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const searchKey = searchParams.toString();

	const isInitialRender = useRef(true);
	const isPopNavigation = useRef(false);
	const prevPathname = useRef(pathname);
	const lastScrollY = useRef(0);

	useEffect(() => {
		const previousScrollRestoration = "scrollRestoration" in history ? history.scrollRestoration : null;
		if ("scrollRestoration" in history) {
			history.scrollRestoration = "manual";
		}

		let scrollRafId: number | null = null;

		const persistScroll = (y: number) => {
			lastScrollY.current = y;
			rememberScrollPosition(getScrollKey(), y);
		};

		const flushScrollPosition = () => {
			persistScroll(lastScrollY.current);
		};

		const handleScroll = () => {
			lastScrollY.current = window.scrollY;
			if (scrollRafId != null) return;
			scrollRafId = requestAnimationFrame(() => {
				scrollRafId = null;
				rememberScrollPosition(getScrollKey(), lastScrollY.current);
			});
		};

		const handlePopState = () => {
			isPopNavigation.current = true;
			// Destination URL is already in the bar, but the outgoing route may still be painted.
			scrollToTop();
		};

		const handleClick = (event: MouseEvent) => {
			if (isModifiedClick(event)) return;

			const target = event.target;
			if (!(target instanceof Element)) return;

			const anchor = target.closest("a");
			if (!(anchor instanceof HTMLAnchorElement) || !isInternalNavigationAnchor(anchor)) {
				return;
			}

			persistScroll(window.scrollY);
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === "hidden") {
				flushScrollPosition();
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("popstate", handlePopState);
		window.addEventListener("pagehide", flushScrollPosition);
		document.addEventListener("visibilitychange", handleVisibilityChange);
		document.addEventListener("click", handleClick, true);

		return () => {
			if (scrollRafId != null) {
				cancelAnimationFrame(scrollRafId);
			}
			if (previousScrollRestoration != null && "scrollRestoration" in history) {
				history.scrollRestoration = previousScrollRestoration;
			}

			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("popstate", handlePopState);
			window.removeEventListener("pagehide", flushScrollPosition);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			document.removeEventListener("click", handleClick, true);
		};
	}, []);

	useLayoutEffect(() => {
		if (isInitialRender.current) {
			isInitialRender.current = false;
			prevPathname.current = pathname;
			return;
		}

		if (isPopNavigation.current) {
			isPopNavigation.current = false;
			prevPathname.current = pathname;
			restoreSavedScrollPosition();
			return;
		}

		const pathnameChanged = prevPathname.current !== pathname;
		prevPathname.current = pathname;

		// Query-only forward nav — respect `router.push(..., { scroll: false })`.
		if (!pathnameChanged) {
			return;
		}

		if (scrollToHashIfPresent()) {
			return;
		}

		scrollToTop();
	}, [pathname, searchKey]);

	return null;
}
