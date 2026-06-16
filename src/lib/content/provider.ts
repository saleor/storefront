import { defaultStorefrontContent } from "@/lib/content/defaults";
import { saleorContentProvider } from "@/lib/content/saleor/saleor-provider";
import type { ContentProviderId, StorefrontContent, StorefrontContentRequest } from "@/lib/content/types";

export type ContentProvider = {
	id: ContentProviderId;
	load(request: StorefrontContentRequest): Promise<StorefrontContent>;
};

const codeProvider: ContentProvider = {
	id: "code",
	async load() {
		return defaultStorefrontContent;
	},
};

function resolveContentProviderId(): ContentProviderId {
	// Bracket access — Next.js inlines `process.env.CONTENT_PROVIDER` at build time; dynamic
	// lookup keeps Vercel/runtime env changes effective without a rebuild.
	const value = process.env["CONTENT_PROVIDER"]?.trim().toLowerCase();
	if (value === "saleor" || value === "url") return value;
	return "code";
}

export function resolveContentProvider(): ContentProvider {
	const id = resolveContentProviderId();

	switch (id) {
		case "code":
			return codeProvider;
		case "saleor":
			return saleorContentProvider;
		case "url":
			console.warn("[content] CONTENT_PROVIDER=url not implemented; using code defaults.");
			return codeProvider;
		default:
			return codeProvider;
	}
}

export async function loadStorefrontContent(request: StorefrontContentRequest): Promise<StorefrontContent> {
	return resolveContentProvider().load(request);
}
