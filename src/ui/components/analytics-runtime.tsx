"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
	applyCampaignFromSnapshot,
	applyConsentToGtag,
	bindPaperAnalyticsApi,
	persistFirstTouch,
	sendRedactedPageView,
} from "@/lib/analytics/browser";

if (typeof window !== "undefined") {
	bindPaperAnalyticsApi();
}

/**
 * Client leaf: first-touch snapshot, fork consent API, redacted GA page views
 * on pathname change (not `?step=` — checkout stays one page).
 */
export function AnalyticsRuntime() {
	const pathname = usePathname();

	useEffect(() => {
		bindPaperAnalyticsApi();
		persistFirstTouch();
		applyConsentToGtag();
		applyCampaignFromSnapshot();
	}, []);

	useEffect(() => {
		if (!pathname) return;
		sendRedactedPageView(pathname);
	}, [pathname]);

	return null;
}
