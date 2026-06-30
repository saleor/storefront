"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import { revalidateStorefrontChromeAction } from "@/app/actions";

/**
 * Keeps header auth chrome in sync with HttpOnly session cookies.
 *
 * - First paint: revalidate channel layout + refresh once — busts a PPR/layout shell that
 *   rendered the anonymous header before the session cookie was read.
 * - Tab becomes visible: revalidate layout + refresh (login/logout in another tab).
 *
 * Deliberately does NOT refresh on in-store navigation. The header lives in the shared
 * layout (preserved across sibling navigations), and every session/cart mutation already
 * busts chrome via `revalidateStorefrontChrome` (add-to-cart, cart line edits, login/logout,
 * checkout). Refreshing on every pathname change forced a server round-trip per soft nav,
 * which defeated instant navigations to prerendered shells — most visibly returning to the
 * homepage, which has no loading skeleton to mask the wait.
 */
export function HeaderAuthRefresh({ channel, children }: { channel: string; children: ReactNode }) {
	const router = useRouter();
	const hasSyncedInitialChrome = useRef(false);

	useEffect(() => {
		if (hasSyncedInitialChrome.current) return;
		hasSyncedInitialChrome.current = true;
		void revalidateStorefrontChromeAction(channel).then(() => {
			router.refresh();
		});
	}, [channel, router]);

	useEffect(() => {
		const syncAuthAfterTabFocus = () => {
			if (document.visibilityState !== "visible") {
				return;
			}

			void revalidateStorefrontChromeAction(channel).then(() => {
				router.refresh();
			});
		};

		document.addEventListener("visibilitychange", syncAuthAfterTabFocus);
		return () => document.removeEventListener("visibilitychange", syncAuthAfterTabFocus);
	}, [channel, router]);

	return children;
}
