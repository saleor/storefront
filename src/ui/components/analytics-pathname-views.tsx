"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sendRedactedPageView } from "@/lib/analytics/browser";

/**
 * Redacted merchant-tag page views on pathname change (not `?step=`).
 * Must stay inside `<Suspense>` — `usePathname` suspends on fallback params.
 * https://nextjs.org/docs/messages/blocking-prerender-client-hook
 */
export function AnalyticsPathnameViews() {
	const pathname = usePathname();

	useEffect(() => {
		if (!pathname) return;
		sendRedactedPageView();
	}, [pathname]);

	return null;
}
