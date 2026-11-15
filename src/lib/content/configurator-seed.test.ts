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

	it("leaves the free-shipping threshold and the returns window unset by default", () => {
		const [policies] = buildConfiguratorSeedModels(defaultStorefrontContent);

		// The threshold comes from Saleor's shipping methods, and a returns window is the
		// merchant's statement. A seeded value would make a claim on their behalf.
		expect(policies.attributes).toEqual({});
	});

	it("exports a returns window a fork set in its defaults", () => {
		const [policies] = buildConfiguratorSeedModels({
			...defaultStorefrontContent,
			policies: { ...defaultStorefrontContent.policies, returns: { windowDays: 30 } },
		});

		expect(policies.attributes).toEqual({ "Returns window days": 30 });
	});

	it("exports a free-shipping threshold a fork set in its defaults", () => {
		const [policies] = buildConfiguratorSeedModels({
			...defaultStorefrontContent,
			policies: {
				...defaultStorefrontContent.policies,
				shipping: { freeShippingThreshold: 50 },
			},
		});

		expect(policies.attributes).toMatchObject({
			"Free shipping threshold override (not recommended)": 50,
		});
	});
});
