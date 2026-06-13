import { describe, expect, it } from "vitest";
import { attrText, buildAttributeMap } from "./attributes";

describe("buildAttributeMap", () => {
	it("prefers plain-text attribute translation over default value", () => {
		const map = buildAttributeMap({
			slug: "storefront-homepage",
			isPublished: true,
			pageType: { slug: "storefront-homepage" },
			assignedAttributes: [
				{
					attribute: { slug: "hero-heading" },
					plainText: "Welcome",
					plainTextTranslation: "Witamy",
				},
			],
		});

		expect(attrText(map, "hero-heading")).toBe("Witamy");
	});

	it("falls back to default plain text when translation is empty", () => {
		const map = buildAttributeMap({
			slug: "storefront-homepage",
			isPublished: true,
			pageType: { slug: "storefront-homepage" },
			assignedAttributes: [
				{
					attribute: { slug: "hero-heading" },
					plainText: "Welcome",
					plainTextTranslation: "",
				},
			],
		});

		expect(attrText(map, "hero-heading")).toBe("Welcome");
	});
});
