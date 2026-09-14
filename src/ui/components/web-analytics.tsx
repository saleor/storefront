"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { redactAnalyticsUrl } from "@/lib/analytics/redact-url";

// Module-level so the reference is stable across renders (the SDK registers it in an effect).
function beforeSend(event: BeforeSendEvent): BeforeSendEvent {
	return { ...event, url: redactAnalyticsUrl(event.url) };
}

/**
 * Vercel Web Analytics with Paper's URL redaction (`beforeSend` is a function, so this
 * has to be a client leaf — the server layout gates it with `webAnalyticsEnabled()`).
 * Unsampled by design: page views are the denominator the cost model lacks.
 */
export function WebAnalytics() {
	return <Analytics beforeSend={beforeSend} />;
}
