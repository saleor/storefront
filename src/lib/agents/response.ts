import { agentLinkHeader, markdownPath } from "@/lib/agents/negotiation";

export function agentNotFound() {
	return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
}

export function markdownResponse(body: string, pathname?: string) {
	return new Response(body, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"X-Content-Type-Options": "nosniff",
			// Data loaders retain their existing tagged caches; do not add an uninvalidated CDN cache.
			"Cache-Control": "private, no-store",
			Vary: "Accept",
			...(pathname ? { "Content-Location": markdownPath(pathname), Link: agentLinkHeader(pathname) } : {}),
		},
	});
}
