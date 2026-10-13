/** Require an explicit Markdown preference. Wildcards alone remain HTML. */
export function prefersMarkdown(accept: string | null): boolean {
	const ranges = (accept ?? "").split(",").map((entry) => {
		const [type, ...params] = entry.trim().toLowerCase().split(";");
		const quality = params.find((param) => param.trim().startsWith("q="));
		const q = quality ? Number(quality.trim().slice(2)) : 1;
		return { type, q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 };
	});
	const markdown = ranges.find((range) => range.type === "text/markdown");
	const html =
		ranges.find((range) => range.type === "text/html") ??
		ranges.find((range) => range.type === "text/*") ??
		ranges.find((range) => range.type === "*/*");
	return Boolean(markdown && markdown.q > 0 && markdown.q >= (html?.q ?? 0));
}

/** Only public browse surfaces have Markdown representations. */
export function isAgentPagePath(pathname: string): boolean {
	if (["api", "checkout", "order", "agent-pages", "agents", "_next"].includes(pathname.split("/")[1])) {
		return false;
	}
	return /^\/[^/.]+\/[^/.]+(?:\/(?:products(?:\/[^/]+)?|categories\/[^/]+|collections\/[^/]+|pages\/[^/]+))?\/?$/.test(
		pathname,
	);
}

export function markdownPath(pathname: string): string {
	return `${pathname.replace(/\/$/, "")}.md`;
}

export function agentLinkHeader(pathname: string): string {
	return `</agents.md>; rel="help"; type="text/markdown", <${markdownPath(pathname)}>; rel="alternate"; type="text/markdown"`;
}
