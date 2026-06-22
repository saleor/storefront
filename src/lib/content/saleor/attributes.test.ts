import { describe, expect, it } from "vitest";
import { attrInt, attrNumber, attrText, buildAttributeMap } from "./attributes";

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

describe("attrNumber / attrInt", () => {
	function numericMap(slug: string, numeric: number | null) {
		return buildAttributeMap({
			slug: "storefront-policy",
			isPublished: true,
			pageType: { slug: "storefront-policies" },
			assignedAttributes: [{ attribute: { slug }, numeric }],
		});
	}

	it("reads NUMERIC attribute values, including zero", () => {
		expect(attrNumber(numericMap("free-shipping-threshold", 75), "free-shipping-threshold")).toBe(75);
		expect(attrNumber(numericMap("free-shipping-threshold", 0), "free-shipping-threshold")).toBe(0);
	});

	it("returns undefined for unset attributes so merge keeps defaults", () => {
		expect(
			attrNumber(numericMap("free-shipping-threshold", null), "free-shipping-threshold"),
		).toBeUndefined();
		expect(attrNumber(new Map(), "missing")).toBeUndefined();
	});

	it("truncates to an int and falls back to numeric plain text", () => {
		expect(attrInt(numericMap("featured-limit", 8.9), "featured-limit")).toBe(8);
		const textMap = buildAttributeMap({
			slug: "storefront-homepage",
			isPublished: true,
			pageType: { slug: "storefront-homepage" },
			assignedAttributes: [{ attribute: { slug: "featured-limit" }, plainText: "12" }],
		});
		expect(attrInt(textMap, "featured-limit")).toBe(12);
	});
});
