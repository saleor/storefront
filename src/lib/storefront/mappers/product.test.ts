import { describe, expect, it } from "vitest";

import type { ProductShell } from "@/lib/catalog/get-product-data";
import { toProductView } from "@/lib/storefront/mappers/product";

function shell(): ProductShell {
	return {
		id: "p1",
		slug: "tee",
		name: "Tee",
		description: "Soft cotton",
		seoTitle: "SEO tee",
		seoDescription: null,
		category: { id: "c1", name: "Tops", slug: "tops" },
		assignedAttributes: [
			{
				attribute: { name: "Material", slug: "material", translation: null },
				plainText: "Cotton",
				plainTextTranslation: null,
			},
			{
				attribute: { name: "Size", slug: "size", translation: null },
				plainText: "M",
				plainTextTranslation: null,
			},
			{
				attribute: { name: "Care", slug: "care", translation: null },
				plainText: "Cold wash",
				plainTextTranslation: null,
			},
		],
		media: [
			{
				type: "IMAGE",
				url: "https://cdn.example/2048",
				url256: "https://cdn.example/256",
				url512: "https://cdn.example/512",
				url1024: "https://cdn.example/1024",
				alt: "Tee",
			},
		],
		thumbnail: null,
		pricing: {
			priceRange: {
				start: { gross: { amount: 10, currency: "USD" } },
				stop: { gross: { amount: 20, currency: "USD" } },
			},
		},
		isAvailable: true,
		bestseller: { value: true },
		pulseBestseller: null,
		productVariants: { totalCount: 3 },
	} as unknown as ProductShell;
}

function withAttributes(
	attributes: Array<{ slug: string; name: string; text: string; translation?: string }>,
): ProductShell {
	return {
		...shell(),
		assignedAttributes: attributes.map(({ slug, name, text, translation }) => ({
			attribute: { name, slug, translation: null },
			plainText: text,
			plainTextTranslation: translation ?? null,
		})),
	} as unknown as ProductShell;
}

describe("toProductView safety", () => {
	it("moves the safety attributes into their own block and out of the specs", () => {
		const view = toProductView(
			withAttributes([
				{ slug: "material", name: "Material", text: "100% polyester", translation: "100 % Polyester" },
				{ slug: "safety-information", name: "Safety information", text: "Keep away from open flames." },
				{
					slug: "manufacturer",
					name: "Manufacturer",
					text: "Northvale Outfitters GmbH, Musterstraße 1, 10115 Berlin, Germany, hello@example.com",
				},
				{ slug: "fit", name: "Fit", text: "Regular" },
			]),
		);

		expect(view.safety).toEqual({
			material: "100 % Polyester",
			safetyInformation: "Keep away from open flames.",
			manufacturer: "Northvale Outfitters GmbH, Musterstraße 1, 10115 Berlin, Germany, hello@example.com",
			euResponsiblePerson: null,
		});
		expect(view.attributes).toEqual([{ name: "Fit", value: "Regular" }]);
	});

	it("is null for a product without any of them", () => {
		expect(toProductView(withAttributes([{ slug: "fit", name: "Fit", text: "Regular" }])).safety).toBeNull();
	});
});

describe("toProductView", () => {
	it("maps the shell and drops variant and care attributes from specs", () => {
		const view = toProductView(shell());

		expect(view).toMatchObject({
			id: "p1",
			slug: "tee",
			name: "Tee",
			category: { id: "c1", name: "Tops", slug: "tops" },
			careInstructions: "Cold wash",
			isAvailable: true,
			isBestseller: true,
			variantCount: 3,
			seoTitle: "SEO tee",
			seoDescription: null,
			priceRange: { low: 10, high: 20, currency: "USD" },
			extensions: {},
		});
		// Material is a safety field now: shown under the buy box, not in the specs.
		expect(view.attributes).toEqual([]);
		expect(view.safety).toMatchObject({ material: "Cotton" });
		expect(view.descriptionHtml).toEqual(["<p>Soft cotton</p>"]);
		expect(view.images[0]).toMatchObject({
			url: "https://cdn.example/2048",
			alt: "Tee",
			thumbSrc: "https://cdn.example/256",
		});
		expect(view.images[0]?.srcSet).toContain("512w");
	});
});
