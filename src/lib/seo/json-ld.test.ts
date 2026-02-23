import { describe, it, expect } from "vitest";
import { buildProductJsonLd, jsonLdScriptProps } from "./json-ld";

// =============================================================================
// buildProductJsonLd
// =============================================================================
describe("buildProductJsonLd", () => {
	it("builds basic product JSON-LD", () => {
		const result = buildProductJsonLd({
			name: "Blue T-Shirt",
			price: { amount: 29.99, currency: "USD" },
		});

		expect(result).not.toBeNull();
		expect(result?.["@context"]).toBe("https://schema.org");
		expect(result?.["@type"]).toBe("Product");
		expect(result?.name).toBe("Blue T-Shirt");
	});

	it("includes Offer with price data", () => {
		const result = buildProductJsonLd({
			name: "Shirt",
			price: { amount: 29.99, currency: "USD" },
			inStock: true,
		});

		const offers = result?.offers as Record<string, unknown>;
		expect(offers?.["@type"]).toBe("Offer");
		expect(offers?.priceCurrency).toBe("USD");
		expect(offers?.price).toBe(29.99);
		expect(offers?.availability).toBe("https://schema.org/InStock");
	});

	it("marks out of stock correctly", () => {
		const result = buildProductJsonLd({
			name: "Shirt",
			price: { amount: 29.99, currency: "USD" },
			inStock: false,
		});

		const offers = result?.offers as Record<string, unknown>;
		expect(offers?.availability).toBe("https://schema.org/OutOfStock");
	});

	it("defaults to in stock when inStock not specified", () => {
		const result = buildProductJsonLd({
			name: "Shirt",
			price: { amount: 10, currency: "USD" },
		});

		const offers = result?.offers as Record<string, unknown>;
		expect(offers?.availability).toBe("https://schema.org/InStock");
	});

	it("builds AggregateOffer for price ranges", () => {
		const result = buildProductJsonLd({
			name: "Shirt",
			priceRange: { lowPrice: 19.99, highPrice: 49.99, currency: "EUR" },
			variantCount: 5,
		});

		const offers = result?.offers as Record<string, unknown>;
		expect(offers?.["@type"]).toBe("AggregateOffer");
		expect(offers?.lowPrice).toBe(19.99);
		expect(offers?.highPrice).toBe(49.99);
		expect(offers?.priceCurrency).toBe("EUR");
		expect(offers?.offerCount).toBe(5);
	});

	it("prefers single price over price range when both provided", () => {
		const result = buildProductJsonLd({
			name: "Shirt",
			price: { amount: 29.99, currency: "USD" },
			priceRange: { lowPrice: 19.99, highPrice: 49.99, currency: "USD" },
		});

		const offers = result?.offers as Record<string, unknown>;
		expect(offers?.["@type"]).toBe("Offer");
	});

	it("includes brand", () => {
		const result = buildProductJsonLd({ name: "Shirt", brand: "Acme" });
		const brand = result?.brand as Record<string, unknown>;
		expect(brand?.["@type"]).toBe("Brand");
		expect(brand?.name).toBe("Acme");
	});

	it("includes SKU when provided", () => {
		const result = buildProductJsonLd({ name: "Shirt", sku: "SKU-123" });
		expect(result?.sku).toBe("SKU-123");
	});

	it("omits SKU when not provided", () => {
		const result = buildProductJsonLd({ name: "Shirt" });
		expect(result).not.toHaveProperty("sku");
	});

	it("includes images", () => {
		const result = buildProductJsonLd({
			name: "Shirt",
			images: ["https://cdn.example.com/img1.jpg", "https://cdn.example.com/img2.jpg"],
		});
		expect(result?.image).toEqual(["https://cdn.example.com/img1.jpg", "https://cdn.example.com/img2.jpg"]);
	});

	it("omits images when empty array", () => {
		const result = buildProductJsonLd({ name: "Shirt", images: [] });
		expect(result?.image).toBeUndefined();
	});

	it("uses description or falls back to name", () => {
		const withDesc = buildProductJsonLd({ name: "Shirt", description: "A nice shirt" });
		expect(withDesc?.description).toBe("A nice shirt");

		const withoutDesc = buildProductJsonLd({ name: "Shirt" });
		expect(withoutDesc?.description).toBe("Shirt");
	});

	it("omits offers when no price data provided", () => {
		const result = buildProductJsonLd({ name: "Shirt" });
		expect(result?.offers).toBeUndefined();
	});

	it("builds full URL from relative path", () => {
		const result = buildProductJsonLd({
			name: "Shirt",
			url: "/us/products/shirt",
			price: { amount: 10, currency: "USD" },
		});

		const offers = result?.offers as Record<string, unknown>;
		expect(offers?.url).toContain("/us/products/shirt");
	});
});

// =============================================================================
// jsonLdScriptProps
// =============================================================================
describe("jsonLdScriptProps", () => {
	it("returns script props for valid data", () => {
		const data = { "@context": "https://schema.org", "@type": "Product", name: "Test" };
		const result = jsonLdScriptProps(data);

		expect(result?.type).toBe("application/ld+json");
		expect(result?.dangerouslySetInnerHTML.__html).toBe(JSON.stringify(data));
	});

	it("returns null for null data", () => {
		expect(jsonLdScriptProps(null)).toBeNull();
	});
});
