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

	it("maps editorial drawer copy from Saleor attributes, keeping defaults for unset fields", () => {
		const partial = mapCartPage(
			cartPage([
				{ slug: "drawer-title", plainText: "Twój koszyk" },
				{ slug: "drawer-free-shipping-qualified", plainText: "Masz darmową dostawę!" },
			]),
		);
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.surfaces.cart.drawer.title).toBe("Twój koszyk");
		expect(merged.surfaces.cart.drawer.freeShippingQualified).toBe("Masz darmową dostawę!");
		expect(merged.surfaces.cart.drawer.addForFreeShipping).toBe(
			defaultStorefrontContent.surfaces.cart.drawer.addForFreeShipping,
		);
	});
});
