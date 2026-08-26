import { describe, expect, it } from "vitest";

import { defaultStorefrontContent } from "@/lib/content";
import { variantSectionFallbackProps } from "./variant-section-fallback";

describe("variantSectionFallbackProps", () => {
	it("formats the shell price range and free-shipping trust line", () => {
		const props = variantSectionFallbackProps({
			product: {
				category: { name: "Sneakers" },
				pricing: {
					priceRange: {
						start: { gross: { amount: 90, currency: "USD" } },
						stop: { gross: { amount: 90, currency: "USD" } },
					},
				},
			},
			content: defaultStorefrontContent,
			currency: "USD",
			locale: "en-US",
			selectOptionsLabel: "Select options",
		});

		expect(props.categoryName).toBe("Sneakers");
		expect(props.price).toBe("$90.00");
		expect(props.selectOptionsLabel).toBe("Select options");
		expect(props.secureCheckoutLabel).toBe(defaultStorefrontContent.surfaces.checkout.trust.secureCheckout);
		expect(props.freeShippingTrustLabel).toMatch(/75/);
	});

	it("omits the free-shipping line when the channel has no threshold", () => {
		const props = variantSectionFallbackProps({
			product: {},
			content: {
				...defaultStorefrontContent,
				policies: {
					...defaultStorefrontContent.policies,
					shipping: { freeShippingThreshold: null },
				},
			},
			currency: "USD",
			locale: "en-US",
			selectOptionsLabel: "Select options",
		});

		expect(props.price).toBe("");
		expect(props.freeShippingTrustLabel).toBeNull();
	});
});
