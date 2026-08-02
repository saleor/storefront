import { describe, expect, it } from "vitest";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { mergeStorefrontContent } from "@/lib/content/merge";
import { mapCheckoutPage } from "@/lib/content/saleor/mappers/checkout";
import type { StorefrontContentPageFragment } from "@/gql/graphql";

function checkoutPage(
	attributes: Array<{ slug: string; plainText?: string | null }>,
): StorefrontContentPageFragment {
	return {
		slug: "storefront-checkout",
		isPublished: true,
		pageType: { slug: "storefront-checkout" },
		assignedAttributes: attributes.map(({ slug, plainText }) => ({
			attribute: { slug },
			plainText,
		})),
	};
}

describe("mapCheckoutPage", () => {
	it("keeps default trust copy when only marketing opt-in label is set in Saleor", () => {
		const partial = mapCheckoutPage(
			checkoutPage([{ slug: "marketing-opt-in-label", plainText: "Email me deals" }]),
		);
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.surfaces.checkout.marketingOptInLabel).toBe("Email me deals");
		expect(merged.surfaces.checkout.trust.secureCheckout).toBe(
			defaultStorefrontContent.surfaces.checkout.trust.secureCheckout,
		);
	});
});
