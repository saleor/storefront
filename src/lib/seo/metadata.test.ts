import { describe, it, expect } from "vitest";
import { truncateText, buildPageMetadata } from "./metadata";

// =============================================================================
// truncateText
// =============================================================================
describe("truncateText", () => {
	it("returns text unchanged when under limit", () => {
		expect(truncateText("Short text", 60)).toBe("Short text");
	});

	it("returns text unchanged when exactly at limit", () => {
		const exact = "a".repeat(60);
		expect(truncateText(exact, 60)).toBe(exact);
	});

	it("truncates at word boundary", () => {
		const text = "The quick brown fox jumps over the lazy dog and more words";
		const result = truncateText(text, 30);
		expect(result.length).toBeLessThanOrEqual(31);
		expect(result.endsWith("…")).toBe(true);
		expect(result).not.toContain("  ");
	});

	it("appends ellipsis character", () => {
		const text = "a".repeat(100);
		const result = truncateText(text, 50);
		expect(result.endsWith("…")).toBe(true);
	});

	it("handles text with no spaces (single long word)", () => {
		const text = "a".repeat(100);
		const result = truncateText(text, 50);
		expect(result.endsWith("…")).toBe(true);
	});
});

// =============================================================================
// buildPageMetadata
// =============================================================================
describe("buildPageMetadata", () => {
	it("includes title", () => {
		const meta = buildPageMetadata({ title: "My Product" });
		expect(meta.title).toBe("My Product");
	});

	it("includes description", () => {
		const meta = buildPageMetadata({
			title: "Product",
			description: "A great product",
		});
		expect(meta.description).toBe("A great product");
	});

	it("truncates long titles to 60 chars", () => {
		const longTitle =
			"This is a very long product title that exceeds the sixty character recommendation for SEO";
		const meta = buildPageMetadata({ title: longTitle });
		expect(typeof meta.title).toBe("string");
		expect((meta.title as string).length).toBeLessThanOrEqual(61); // 60 + ellipsis
	});

	it("truncates long descriptions to 155 chars", () => {
		const longDesc = "x ".repeat(100); // 200 chars
		const meta = buildPageMetadata({ title: "Test", description: longDesc });
		expect(typeof meta.description).toBe("string");
		expect((meta.description as string).length).toBeLessThanOrEqual(156);
	});

	it("includes canonical URL", () => {
		const meta = buildPageMetadata({
			title: "Product",
			url: "/us/products/shirt",
		});
		expect(meta.alternates?.canonical).toBe("/us/products/shirt");
	});

	it("omits canonical when no URL", () => {
		const meta = buildPageMetadata({ title: "Product" });
		expect(meta.alternates).toBeUndefined();
	});

	it("includes OpenGraph data", () => {
		const meta = buildPageMetadata({
			title: "Shirt",
			description: "A nice shirt",
			image: "https://cdn.example.com/img.jpg",
			url: "/products/shirt",
		});

		expect(meta.openGraph).toBeDefined();
		expect(meta.openGraph?.title).toBe("Shirt");
		expect(meta.openGraph?.description).toBe("A nice shirt");
		expect(meta.openGraph?.images).toHaveLength(1);
	});

	it("includes Twitter card data", () => {
		const meta = buildPageMetadata({
			title: "Shirt",
			image: "https://cdn.example.com/img.jpg",
		});

		expect(meta.twitter).toBeDefined();
		expect(meta.twitter?.card).toBe("summary_large_image");
		expect(meta.twitter?.title).toBe("Shirt");
	});

	it("omits OG images when no image provided", () => {
		const meta = buildPageMetadata({ title: "Product" });
		expect(meta.openGraph?.images).toBeUndefined();
	});

	it("omits Twitter images when no image provided", () => {
		const meta = buildPageMetadata({ title: "Product" });
		expect(meta.twitter?.images).toBeUndefined();
	});

	it("handles null image gracefully", () => {
		const meta = buildPageMetadata({ title: "Product", image: null });
		expect(meta.openGraph?.images).toBeUndefined();
	});
});
