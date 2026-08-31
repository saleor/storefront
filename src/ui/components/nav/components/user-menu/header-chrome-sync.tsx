"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, type ReactNode } from "react";

import { CHROME_LOCAL_BUMP_EVENT, CHROME_VERSION_KEY, readChromeVersion } from "@/lib/chrome-sync";

/**
 * Refreshes header auth/cart chrome when *another tab* changed session or cart
 * state (login, logout, cart mutation, order placed).
 *
 * Same-tab freshness never needs this component: the served document renders
 * the cookie-gated chrome holes with current cookies, and mutations refresh
 * the router themselves (server actions call `refresh()` from `next/cache`;
 * auth boundaries hard-navigate). Cross-tab, mutators call
 * `bumpChromeVersion()`; this listens for the version change and re-renders
 * once when the tab is (or becomes) visible.
 *
 * Deliberately does **no work on mount and no server round-trip per focus**.
 * The previous design invalidated the whole locale/channel layout (a sitewide
 * shared-cache purge) via a Server Action on every hard load and tab refocus —
 * a per-visitor Vercel cost multiplier that also busted caches shared by all
 * users. See the `paper-vercel-cost` rule.
 */
export function HeaderChromeSync({ children }: { children: ReactNode }) {
	const router = useRouter();

	useEffect(() => {
		let lastSyncedVersion = readChromeVersion();

		const syncIfStale = () => {
			// Hidden tabs wait for refocus — N background tabs must not all
			// re-render on one bump.
			if (document.visibilityState !== "visible") return;
			const version = readChromeVersion();
			if (version === lastSyncedVersion) return;
			lastSyncedVersion = version;
			startTransition(() => {
				router.refresh();
			});
		};

		const syncOnStorage = (event: StorageEvent) => {
			// `key === null` means storage was cleared wholesale.
			if (event.key !== null && event.key !== CHROME_VERSION_KEY) return;
			syncIfStale();
		};

		// This tab's own bump: adopt the version without refreshing — the acting
		// tab is already fresh (server action `refresh()` / hard navigation), and
		// `storage` events never fire in the tab that wrote.
		const adoptOwnBump = () => {
			lastSyncedVersion = readChromeVersion();
		};

		// pageshow covers bfcache restores, where effects don't re-run but the
		// restored DOM may predate a mutation in another tab.
		window.addEventListener("storage", syncOnStorage);
		window.addEventListener(CHROME_LOCAL_BUMP_EVENT, adoptOwnBump);
		window.addEventListener("pageshow", syncIfStale);
		document.addEventListener("visibilitychange", syncIfStale);
		return () => {
			window.removeEventListener("storage", syncOnStorage);
			window.removeEventListener(CHROME_LOCAL_BUMP_EVENT, adoptOwnBump);
			window.removeEventListener("pageshow", syncIfStale);
			document.removeEventListener("visibilitychange", syncIfStale);
		};
	}, [router]);

	return children;
}
