import { describe, expect, it } from "vitest";
import {
	appendSearchParams,
	rewriteCatalogSuffixForLocaleSwitch,
	safeLocaleSwitchSuffixWithoutIdentity,
} from "./catalog-identity";

describe("rewriteCatalogSuffixForLocaleSwitch", () => {
	it("uses the target locale slug when localeSlugs is provided", () => {
		expect(
			rewriteCatalogSuffixForLocaleSwitch(
				"/products/bluza",
				{
					kind: "products",
					primarySlug: "hoodie",
					localeSlugs: { en: "hoodie", pl: "bluza", de: "kapuzenpullover" },
				},
				"de",
			),
		).toBe("/products/kapuzenpullover");
	});

	it("falls back to primary slug when the target locale is missing", () => {
		expect(
			rewriteCatalogSuffixForLocaleSwitch(
				"/products/bluza",
				{ kind: "products", primarySlug: "hoodie" },
				"en",
			),
		).toBe("/products/hoodie");
	});

	it("leaves non-matching kinds unchanged", () => {
		expect(
			rewriteCatalogSuffixForLocaleSwitch(
				"/categories/bluza",
				{ kind: "products", primarySlug: "hoodie" },
				"en",
			),
		).toBe("/categories/bluza");
	});
});

describe("safeLocaleSwitchSuffixWithoutIdentity", () => {
	it("drops PDP to the products listing", () => {
		expect(safeLocaleSwitchSuffixWithoutIdentity("/products/bluza")).toBe("/products");
	});

	it("drops category/collection/page detail to home", () => {
		expect(safeLocaleSwitchSuffixWithoutIdentity("/categories/odziez")).toBe("");
		expect(safeLocaleSwitchSuffixWithoutIdentity("/collections/lato")).toBe("");
		expect(safeLocaleSwitchSuffixWithoutIdentity("/pages/o-nas")).toBe("");
	});

	it("preserves non-detail suffixes", () => {
		expect(safeLocaleSwitchSuffixWithoutIdentity("/products")).toBe("/products");
		expect(safeLocaleSwitchSuffixWithoutIdentity("/cart")).toBe("/cart");
	});
});

describe("appendSearchParams", () => {
	it("appends a query string", () => {
		expect(appendSearchParams("/en/pl/products/hoodie", "variant=abc")).toBe(
			"/en/pl/products/hoodie?variant=abc",
		);
	});

	it("no-ops when empty", () => {
		expect(appendSearchParams("/en/pl/products/hoodie", "")).toBe("/en/pl/products/hoodie");
	});
});
