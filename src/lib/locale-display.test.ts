import { describe, expect, it } from "vitest";
import { getLocaleEndonym, getStorefrontLocaleOptions } from "./locale-display";

describe("getLocaleEndonym", () => {
	it("returns endonyms in the language's own name", () => {
		expect(getLocaleEndonym("en")).toBe("English");
		expect(getLocaleEndonym("de")).toBe("Deutsch");
		expect(getLocaleEndonym("pl")).toBe("polski");
	});
});

describe("getStorefrontLocaleOptions", () => {
	it("includes slug and label for each configured locale", () => {
		const options = getStorefrontLocaleOptions();
		expect(options.length).toBeGreaterThanOrEqual(1);
		expect(options[0]).toMatchObject({
			slug: expect.any(String),
			label: expect.any(String),
		});
	});
});
