import { describe, expect, it } from "vitest";
import { appendSearchParams, rewriteCatalogSuffixWithPrimarySlug } from "./catalog-identity";

describe("rewriteCatalogSuffixWithPrimarySlug", () => {
	it("replaces a translated product slug with the primary slug", () => {
		expect(
			rewriteCatalogSuffixWithPrimarySlug("/products/bluza", {
				kind: "products",
				primarySlug: "hoodie",
			}),
		).toBe("/products/hoodie");
	});

	it("leaves non-matching kinds unchanged", () => {
		expect(
			rewriteCatalogSuffixWithPrimarySlug("/categories/bluza", {
				kind: "products",
				primarySlug: "hoodie",
			}),
		).toBe("/categories/bluza");
	});

	it("leaves list paths unchanged", () => {
		expect(
			rewriteCatalogSuffixWithPrimarySlug("/products", {
				kind: "products",
				primarySlug: "hoodie",
			}),
		).toBe("/products");
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
