import { describe, expect, it } from "vitest";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { mergeStorefrontContent } from "@/lib/content/merge";
import { mapHomepagePage } from "@/lib/content/saleor/mappers/homepage";
import type { StorefrontContentPageFragment } from "@/gql/graphql";

function homepagePage(
	attributes: Array<{
		slug: string;
		plainText?: string | null;
		collectionSlug?: string | null;
		fileUrl?: string | null;
	}>,
): StorefrontContentPageFragment {
	return {
		slug: "storefront-homepage",
		isPublished: true,
		pageType: { slug: "storefront-homepage" },
		assignedAttributes: attributes.map(({ slug, plainText, collectionSlug, fileUrl }) => {
			if (collectionSlug) {
				return {
					attribute: { slug },
					collection: { slug: collectionSlug },
				};
			}

			if (fileUrl) {
				return {
					attribute: { slug },
					file: { url: fileUrl },
				};
			}

			return {
				attribute: { slug },
				plainText,
			};
		}),
	};
}

describe("mapHomepagePage", () => {
	it("maps hero image from Saleor FILE attribute", () => {
		const partial = mapHomepagePage(
			homepagePage([{ slug: "hero-image", fileUrl: "https://cdn.example.com/hero.jpg" }]),
		);
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.surfaces.homepage.hero.backgroundImage).toBe("https://cdn.example.com/hero.jpg");
	});

	it("keeps code default subheading when Saleor only sets hero heading", () => {
		const partial = mapHomepagePage(
			homepagePage([
				{ slug: "hero-heading", plainText: "Discover our collection" },
				{ slug: "hero-cta-label", plainText: "Shop all" },
			]),
		);

		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.surfaces.homepage.hero.heading).toBe("Discover our collection");
		expect(merged.surfaces.homepage.hero.primaryCtaLabel).toBe("Shop all");
		expect(merged.surfaces.homepage.hero.subheading).toBe(
			defaultStorefrontContent.surfaces.homepage.hero.subheading,
		);
	});

	it("maps featured collection reference slug from Saleor", () => {
		const partial = mapHomepagePage(
			homepagePage([{ slug: "featured-collection", collectionSlug: "summer-sale" }]),
		);
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.surfaces.homepage.featuredCollection.collectionSlug).toBe("summer-sale");
		expect(merged.surfaces.homepage.featuredCollection.heading).toBe(
			defaultStorefrontContent.surfaces.homepage.featuredCollection.heading,
		);
	});

	it("keeps default editorial paragraphs when only heading is set in Saleor", () => {
		const partial = mapHomepagePage(homepagePage([{ slug: "editorial-heading", plainText: "New story" }]));
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.surfaces.homepage.editorial.heading).toBe("New story");
		expect(merged.surfaces.homepage.editorial.paragraphs).toEqual(
			defaultStorefrontContent.surfaces.homepage.editorial.paragraphs,
		);
	});
});
