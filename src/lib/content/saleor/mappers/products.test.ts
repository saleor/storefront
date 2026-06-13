import { describe, expect, it } from "vitest";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { mergeStorefrontContent } from "@/lib/content/merge";
import { mapProductsPage } from "@/lib/content/saleor/mappers/products";
import type { StorefrontContentPageFragment } from "@/gql/graphql";

function productsPage(attrs: Record<string, string>): StorefrontContentPageFragment {
	return {
		slug: "storefront-products",
		isPublished: true,
		pageType: { slug: "storefront-products" },
		assignedAttributes: Object.entries(attrs).map(([slug, plainText]) => ({
			attribute: { slug },
			plainText,
		})),
	};
}

describe("mapProductsPage", () => {
	it("maps listing copy from Saleor attributes", () => {
		const partial = mapProductsPage(
			productsPage({
				"listing-title": "Alle Produkte",
				"listing-description": "Entdecken Sie unsere Kollektion.",
			}),
		);
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.surfaces.products.title).toBe("Alle Produkte");
		expect(merged.surfaces.products.description).toBe("Entdecken Sie unsere Kollektion.");
		expect(merged.surfaces.products.breadcrumbHome).toBe(
			defaultStorefrontContent.surfaces.products.breadcrumbHome,
		);
	});
});
