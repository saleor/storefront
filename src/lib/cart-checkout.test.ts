import { describe, expect, it } from "vitest";
import { withTranslatedCartCheckout } from "./cart-checkout";

describe("withTranslatedCartCheckout", () => {
	it("translates product, variant, and attribute labels for cart display", () => {
		const checkout = withTranslatedCartCheckout({
			id: "chk",
			email: null,
			totalPrice: { gross: { amount: 10, currency: "PLN" } },
			lines: [
				{
					id: "line-1",
					quantity: 1,
					totalPrice: { gross: { amount: 10, currency: "PLN" } },
					variant: {
						id: "var-1",
						name: "Black S",
						translation: { name: "Czarny S" },
						product: {
							id: "prod-1",
							name: "Hoodie",
							slug: "hoodie",
							translation: { name: "Bluza" },
							thumbnail: null,
							category: {
								name: "Apparel",
								translation: { name: "Odzież" },
							},
						},
						pricing: null,
						selectionAttributes: [
							{
								attribute: {
									name: "Color",
									slug: "color",
									inputType: null,
									translation: { name: "Kolor" },
								},
								values: [
									{
										name: "black",
										value: "black",
										translation: { name: "czarny" },
										file: null,
									},
								],
							},
						],
						nonSelectionAttributes: [],
					},
				},
			],
		});

		const line = checkout.lines[0]!;
		expect(line.variant.product.name).toBe("Bluza");
		expect(line.variant.name).toBe("Czarny S");
		expect(line.variant.product.category?.name).toBe("Odzież");
		expect(line.variant.attributes[0]?.attribute.name).toBe("Kolor");
		expect(line.variant.attributes[0]?.values[0]?.name).toBe("czarny");
	});
});
