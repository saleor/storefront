import { describe, expect, it } from "vitest";
import { defaultStorefrontContent } from "@/lib/content/defaults";
import { mergeStorefrontContent } from "@/lib/content/merge";
import { mapPolicyPage } from "@/lib/content/saleor/mappers/policy";
import type { StorefrontContentPageFragment } from "@/gql/graphql";

type Assigned = { slug: string; numeric: number | null };

function policyPage(attributes: Assigned[], slug = "storefront-policy"): StorefrontContentPageFragment {
	return {
		slug,
		isPublished: true,
		pageType: { slug: "storefront-policies" },
		assignedAttributes: attributes.map((attr) => ({ attribute: { slug: attr.slug }, ...attr })),
	};
}

describe("mapPolicyPage", () => {
	it("ignores pages from other page types", () => {
		const page = policyPage([{ slug: "free-shipping-threshold", numeric: 50 }]);
		expect(mapPolicyPage({ ...page, pageType: { slug: "storefront-chrome" } })).toEqual({});
	});

	it("maps numeric policy attributes", () => {
		const partial = mapPolicyPage(
			policyPage([
				{ slug: "free-shipping-threshold-override-not-recommended", numeric: 300 },
				{ slug: "returns-window-days", numeric: 45 },
			]),
		);
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.policies.shipping.freeShippingThreshold).toBe(300);
		expect(merged.policies.returns.windowDays).toBe(45);
	});

	it("keeps code defaults for unset policy attributes", () => {
		const partial = mapPolicyPage(policyPage([{ slug: "returns-window-days", numeric: 60 }]));
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.policies.returns.windowDays).toBe(60);
		expect(merged.policies.shipping.freeShippingThreshold).toBe(
			defaultStorefrontContent.policies.shipping.freeShippingThreshold,
		);
	});

	it("ignores the attribute from before it was renamed", () => {
		// "Free shipping threshold" was seeded with 75 on every store: not a merchant's choice.
		const partial = mapPolicyPage(
			policyPage([
				{ slug: "free-shipping-threshold", numeric: 75 },
				{ slug: "returns-window-days", numeric: 30 },
			]),
		);
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.policies.shipping.freeShippingThreshold).toBeNull();
	});

	it("supports a zero threshold (free shipping on every order)", () => {
		const partial = mapPolicyPage(
			policyPage([{ slug: "free-shipping-threshold-override-not-recommended", numeric: 0 }]),
		);
		const merged = mergeStorefrontContent(defaultStorefrontContent, partial);

		expect(merged.policies.shipping.freeShippingThreshold).toBe(0);
	});
});
