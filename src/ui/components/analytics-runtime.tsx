"use client";

import { useEffect } from "react";
import {
	applyCampaignFromSnapshot,
	applyConsentToGtag,
	bindPaperAnalyticsApi,
	persistFirstTouch,
} from "@/lib/analytics/browser";

if (typeof window !== "undefined") {
	bindPaperAnalyticsApi();
}

/**
 * Consent API + first-touch. No navigation hooks — stays in the static shell
 * so a fork banner can call `window.paperAnalytics` before pathname resolves.
 */
export function AnalyticsRuntime() {
	useEffect(() => {
		bindPaperAnalyticsApi();
		persistFirstTouch();
		applyConsentToGtag();
		applyCampaignFromSnapshot();
	}, []);

	return null;
}
