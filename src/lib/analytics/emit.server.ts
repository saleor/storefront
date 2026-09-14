import "server-only";

import { headers } from "next/headers";
import { after } from "next/server";
import { track } from "@vercel/analytics/server";
import type { PaperCommerceEvent } from "@/lib/analytics/catalog";
import { projectConsole } from "@/lib/analytics/destinations/console";
import { projectVercel } from "@/lib/analytics/destinations/vercel";
import { webAnalyticsEnabled } from "@/lib/analytics/web-analytics";

/**
 * Server publisher. Schedules delivery with `after()` so a Server Action is not
 * held open for the beacon (Vercel maps this to `waitUntil`). Never throws to
 * the caller — analytics must not fail add-to-cart or checkoutComplete.
 */
export function emitCommerceEvent(event: PaperCommerceEvent): void {
	try {
		after(() => {
			void deliver(event);
		});
	} catch (error) {
		console.warn("[analytics] after() unavailable; dropping event", error);
	}
}

async function deliver(event: PaperCommerceEvent): Promise<void> {
	try {
		const vercel = projectVercel(event);
		if (vercel && webAnalyticsEnabled()) {
			// The server SDK throws away the event unless it gets request headers.
			// `after()` often loses the implicit Vercel request context — pass them.
			await track(vercel.name, vercel.props, { headers: await headers() });
		}
		// Server tag delivery is not shipped. Client events
		// (begin_checkout, checkout_step, search) go through emit.client.
		if (process.env.NODE_ENV === "development") {
			projectConsole(event);
		}
	} catch (error) {
		console.warn("[analytics] destination failed", error);
	}
}
