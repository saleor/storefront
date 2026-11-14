import { describe, expect, it } from "vitest";
import { STOREFRONT_PAGE_TYPES, STOREFRONT_POLICY_PAGE_SLUG } from "@/lib/content/constants";
import { buildConfiguratorSeedModels } from "@/lib/content/configurator-seed";
import { defaultStorefrontContent } from "@/lib/content/defaults";

describe("buildConfiguratorSeedModels", () => {
	it("emits one model per storefront surface with stable slugs", () => {
		const models = buildConfiguratorSeedModels(defaultStorefrontContent);

		expect(models).toHaveLength(6);
		expect(models.map((model) => model.slug)).toEqual([
			STOREFRONT_POLICY_PAGE_SLUG,
			STOREFRONT_PAGE_TYPES.chrome,
			STOREFRONT_PAGE_TYPES.products,
			STOREFRONT_PAGE_TYPES.homepage,
			STOREFRONT_PAGE_TYPES.cart,
			STOREFRONT_PAGE_TYPES.checkout,
		]);
	});

	it("maps the returns window and leaves the free-shipping threshold unset by default", () => {
		const [policies] = buildConfiguratorSeedModels(defaultStorefrontContent);

		// The threshold comes from Saleor's shipping methods; a seeded value would override it.
		expect(policies.attributes).toEqual({
			"Returns window days": defaultStorefrontContent.policies.returns.windowDays,
		});
	});

	it("exports a free-shipping threshold a fork set in its defaults", () => {
		const [policies] = buildConfiguratorSeedModels({
			...defaultStorefrontContent,
			policies: {
				...defaultStorefrontContent.policies,
				shipping: { freeShippingThreshold: 50 },
			},
		});

		expect(policies.attributes).toMatchObject({ "Free shipping threshold": 50 });
	});
});
