import { describe, expect, it } from "vitest";
import { pickTranslatedName, withTranslatedProductFields } from "./saleor-translations";

describe("pickTranslatedName", () => {
	it("prefers translation over default name", () => {
		expect(
			pickTranslatedName({
				name: "Hoodie",
				translation: { name: "Bluza" },
			}),
		).toBe("Bluza");
	});

	it("falls back to default name", () => {
		expect(
			pickTranslatedName({
				name: "Hoodie",
				translation: null,
			}),
		).toBe("Hoodie");
	});
});

describe("withTranslatedProductFields", () => {
	it("merges product and category translations", () => {
		const product = withTranslatedProductFields({
			name: "Hoodie",
			translation: { name: "Bluza" },
			category: {
				name: "Apparel",
				translation: { name: "Odzież" },
			},
			variants: [{ name: "M", translation: { name: "Średni" } }],
		});

		expect(product.name).toBe("Bluza");
		expect(product.category?.name).toBe("Odzież");
		expect(product.variants?.[0]?.name).toBe("Średni");
	});
});
