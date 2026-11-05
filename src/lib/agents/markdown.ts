import xss from "xss";

/** Merchant content is data: strip HTML and escape Markdown control characters. */
export function text(value: string | null | undefined): string {
	return xss(value ?? "", {
		whiteList: {},
		stripIgnoreTag: true,
		stripIgnoreTagBody: ["script", "style"],
	}).replace(/[\\`*_{}\[\]()#+.!|>~-]/g, "\\$&");
}

export function richText(value: string | null | undefined): string {
	if (!value) return "";
	try {
		const document = JSON.parse(value) as { blocks?: Array<{ data?: Record<string, unknown> }> };
		if (!Array.isArray(document.blocks)) return text(value);
		function extract(value: unknown): string {
			if (typeof value === "string") return text(value);
			if (Array.isArray(value)) return value.map(extract).filter(Boolean).join("\n\n");
			if (value && typeof value === "object") {
				const data = value as Record<string, unknown>;
				return [data.text, data.content, data.caption, data.items].map(extract).filter(Boolean).join("\n\n");
			}
			return "";
		}
		return document.blocks
			.map((block) => extract(block.data))
			.filter(Boolean)
			.join("\n\n");
	} catch {
		return text(value);
	}
}

export function money(value: { amount: number; currency: string } | null | undefined): string {
	return value ? `${value.amount} ${text(value.currency)}` : "Unavailable";
}

export function link(label: string, url: string): string {
	try {
		const parsed = new URL(url);
		if (!["http:", "https:"].includes(parsed.protocol)) return text(label);
		return `[${text(label)}](<${parsed.href.replace(/>/g, "%3E")}>)`;
	} catch {
		return text(label);
	}
}
