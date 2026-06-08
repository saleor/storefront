"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import { revalidateStorefrontChromeAction } from "@/app/actions";

/**
 * Keeps header auth chrome in sync with HttpOnly session cookies.
 *
 * - First paint: revalidate channel layout + refresh (busts stale PPR/layout cache with session).
 * - In-store navigation: `router.refresh()` only.
 * - Tab becomes visible: revalidate layout + refresh (login/logout in another tab).
 */
export function HeaderAuthRefresh({ channel, children }: { channel: string; children: ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();
	const hasSyncedInitialChrome = useRef(false);

	useEffect(() => {
		if (!hasSyncedInitialChrome.current) {
			hasSyncedInitialChrome.current = true;
			void revalidateStorefrontChromeAction(channel).then(() => {
				router.refresh();
			});
			return;
		}

		router.refresh();
	}, [pathname, channel, router]);

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
