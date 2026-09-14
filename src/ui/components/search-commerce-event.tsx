"use client";

import { useEffect } from "react";
import { claimSearchView } from "@/lib/analytics/claim";
import { emitCommerceEvent } from "@/lib/analytics/emit.client";

/**
 * Fires once per first-page search URL. Pagination omits this component.
 * Claim is per `pathname+search` so React Strict Mode remounts do not double-count.
 * Query text stays on the page — Vercel only gets {zero, channel}.
 */
export function SearchCommerceEvent({ channel, zero }: { channel: string; zero: boolean }) {
	useEffect(() => {
		const href = `${window.location.pathname}${window.location.search}`;
		if (!claimSearchView(href)) return;
		emitCommerceEvent({ name: "search_submitted", channel, zero });
	}, [channel, zero]);

	return null;
}
