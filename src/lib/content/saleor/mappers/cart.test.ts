import { describe, expect, it } from "vitest";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { mergeStorefrontContent } from "@/lib/content/merge";
import { mapCartPage } from "@/lib/content/saleor/mappers/cart";
import type { StorefrontContentPageFragment } from "@/gql/graphql";

function cartPage(
	attributes: Array<{ slug: string; plainText?: string | null }>,
): StorefrontContentPageFragment {
	return {
		slug: "storefront-cart",
		isPublished: true,
		pageType: { slug: "storefront-cart" },
		assignedAttributes: attributes.map(({ slug, plainText }) => ({
			attribute: { slug },
			plainText,
		})),
	};
}

describe("mapCartPage", () => {
	it("keeps default free-shipping prefix when only returns label is set in Saleor", () => {
		const partial = mapCartPage(cartPage([{ slug: "trust-returns-label", plainText: "60-day returns" }]));
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.surfaces.cart.trust.returnsLabel).toBe("60-day returns");
		expect(merged.surfaces.cart.trust.freeShippingPrefix).toBe(
			defaultStorefrontContent.surfaces.cart.trust.freeShippingPrefix,
		);
	});

	it("maps drawer and page chrome labels from Saleor attributes", () => {
		const partial = mapCartPage(
			cartPage([
				{ slug: "drawer-title", plainText: "Twój koszyk" },
				{ slug: "page-title", plainText: "Koszyk" },
				{ slug: "page-checkout", plainText: "Do kasy" },
			]),
		);
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.surfaces.cart.drawer.title).toBe("Twój koszyk");
		expect(merged.surfaces.cart.page.title).toBe("Koszyk");
		expect(merged.surfaces.cart.page.checkout).toBe("Do kasy");
		expect(merged.surfaces.cart.drawer.subtotal).toBe(defaultStorefrontContent.surfaces.cart.drawer.subtotal);
	});
});
