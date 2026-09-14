"use client";

import { track } from "@vercel/analytics";
import { sendGa4Event } from "@/lib/analytics/browser";
import type { PaperCommerceEvent } from "@/lib/analytics/catalog";
import { projectConsole } from "@/lib/analytics/destinations/console";
import { projectGa4 } from "@/lib/analytics/destinations/ga4";
import { projectVercel } from "@/lib/analytics/destinations/vercel";

/**
 * Client publisher. `track()` no-ops when `<WebAnalytics />` is not mounted
 * (`window.va` unset). Do not gate on `webAnalyticsEnabled()` here — `VERCEL`
 * is not a `NEXT_PUBLIC_*` var, so the client would always see "off".
 * The merchant tag is gated on measurement id + consent inside `sendGa4Event`.
 */
export function emitCommerceEvent(event: PaperCommerceEvent): void {
	try {
		const vercel = projectVercel(event);
		if (vercel) {
			track(vercel.name, vercel.props);
		}
		const ga4 = projectGa4(event);
		if (ga4) {
			sendGa4Event(ga4);
		}
		if (process.env.NODE_ENV === "development") {
			projectConsole(event);
		}
	} catch (error) {
		console.warn("[analytics] destination failed", error);
	}
}
