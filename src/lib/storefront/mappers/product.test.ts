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
		expect(view.attributes).toEqual([{ name: "Material", value: "Cotton" }]);
		expect(view.descriptionHtml).toEqual(["<p>Soft cotton</p>"]);
		expect(view.images[0]).toMatchObject({
			url: "https://cdn.example/2048",
			alt: "Tee",
			thumbSrc: "https://cdn.example/256",
		});
		expect(view.images[0]?.srcSet).toContain("512w");
	});
});
