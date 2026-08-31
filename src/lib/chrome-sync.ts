/**
 * Cross-tab signal that header-chrome inputs (session / cart cookies) changed.
 *
 * Same-tab freshness never goes through this module: cart/auth server actions
 * call `refresh()` (next/cache) so the acting tab re-renders its own dynamic
 * holes, and auth boundaries hard-navigate. Other tabs cannot see that, so
 * mutators bump a version here and `HeaderChromeSync` refreshes a stale tab
 * when it is (or becomes) visible.
 *
 * localStorage is the transport: writes fire `storage` events in every other
 * tab, and the value persists so a hidden tab can compare on refocus.
 */
export const CHROME_VERSION_KEY = "paper:chrome-version";

/**
 * Same-document signal that *this* tab just bumped. `storage` events never fire
 * in the writing tab, so without this the acting tab's `HeaderChromeSync` would
 * see its own bump as foreign on the next refocus and issue a redundant
 * `router.refresh()` — the acting tab is already fresh (its server action
 * called `refresh()`, or it hard-navigated).
 */
export const CHROME_LOCAL_BUMP_EVENT = "paper:chrome-version-bumped";

export function bumpChromeVersion(): void {
	try {
		// Unique per bump: a bare timestamp can collide within one millisecond
		// (rapid quantity taps), and an unchanged value fires no `storage` event —
		// other tabs would silently miss the second mutation.
		const version = `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 8)}`;
		localStorage.setItem(CHROME_VERSION_KEY, version);
		window.dispatchEvent(new Event(CHROME_LOCAL_BUMP_EVENT));
	} catch {
		// Private mode / storage disabled — cross-tab sync is best-effort.
	}
}

export function readChromeVersion(): string | null {
	try {
		return localStorage.getItem(CHROME_VERSION_KEY);
	} catch {
		return null;
	}
}
