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

	it("maps policy numbers from defaults", () => {
		const [policies] = buildConfiguratorSeedModels(defaultStorefrontContent);

		expect(policies.attributes).toMatchObject({
			"Free shipping threshold": defaultStorefrontContent.policies.shipping.freeShippingThreshold,
			"Returns window days": defaultStorefrontContent.policies.returns.windowDays,
		});
	});

	it("rejects null free-shipping threshold for seed export", () => {
		expect(() =>
			buildConfiguratorSeedModels({
				...defaultStorefrontContent,
				policies: {
					...defaultStorefrontContent.policies,
					shipping: { freeShippingThreshold: null },
				},
			}),
		).toThrow(/freeShippingThreshold is null/);
	});
});
