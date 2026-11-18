import type { NextRequest } from "next/server";
import { isStorefrontAgentsEnabled } from "@/config/agents";
import { isStorefrontLocaleSlug } from "@/config/locale";
import { isAllowedLocaleChannelPair } from "@/config/locale-channel";
import { getStorefrontChannelSlugs } from "@/lib/channel-slugs";
import { getAgentPage } from "@/lib/agents/pages";
import { isAgentPagePath } from "@/lib/agents/negotiation";
import { agentNotFound, markdownResponse } from "@/lib/agents/response";
import { buildStorefrontPath } from "@/lib/storefront-path";

export async function GET(_request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
	if (!isStorefrontAgentsEnabled()) return agentNotFound();
	const { path } = await context.params;
	const [locale, channel, kind, slug] = path;
	if (
		!isAgentPagePath(`/${path.join("/")}`) ||
		!isStorefrontLocaleSlug(locale) ||
		!isAllowedLocaleChannelPair(locale, channel) ||
		!(await getStorefrontChannelSlugs()).includes(channel)
	) {
		return agentNotFound();
	}
	try {
		const page = await getAgentPage(locale, channel, kind, slug ? encodeURIComponent(slug) : undefined);
		if (!page) return agentNotFound();
		return markdownResponse(page.body, buildStorefrontPath(locale, channel, page.suffix));
	} catch (error) {
		console.error("[agent-pages] Failed to load public catalog", error);
		return new Response("Catalog temporarily unavailable", {
			status: 503,
			headers: { "Cache-Control": "no-store", "Retry-After": "30" },
		});
	}
}
