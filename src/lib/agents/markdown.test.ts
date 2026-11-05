import { describe, expect, it } from "vitest";
import { link, money, richText, text } from "@/lib/agents/markdown";

describe("agent Markdown data fidelity", () => {
	it("distinguishes unknown prices from free products", () => {
		expect(money(null)).toBe("Unavailable");
		expect(money({ amount: 0, currency: "EUR" })).toBe("0 EUR");
	});
	it("preserves paragraphs and nested Editor.js list items", () => {
		const result = richText(
			JSON.stringify({
				blocks: [
					{ type: "paragraph", data: { text: "<b>Machine wash</b>" } },
					{ type: "list", data: { items: [{ content: "Cold", items: [{ content: "Gentle", items: [] }] }] } },
				],
			}),
		);
		expect(result).toBe("Machine wash\n\nCold\n\nGentle");
	});
	it("does not emit active HTML or merchant Markdown links", () => {
		expect(text("<script>bad()</script><b>Title</b> [link](url)")).toBe("Title \\[link\\]\\(url\\)");
		expect(link("Unsafe", "javascript:alert(1)")).toBe("Unsafe");
	});
});
