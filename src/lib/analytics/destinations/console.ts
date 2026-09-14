import type { PaperCommerceEvent } from "@/lib/analytics/catalog";

/** Dev-only subscriber so the bus is visible without a Vercel project. */
export function projectConsole(event: PaperCommerceEvent): void {
	console.info("[paper.analytics]", event.name, event);
}
