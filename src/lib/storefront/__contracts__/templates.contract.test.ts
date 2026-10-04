import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { ACTIVE_PDP_GALLERY, ACTIVE_PDP_TEMPLATE } from "@/config/template-selection";
import { templates } from "@/config/templates";
import { STOREFRONT_CONTRACT_VERSION } from "@/lib/storefront/contract/version";
import type { ProductView } from "@/lib/storefront/contract/product";
import { PDP_TEMPLATES } from "@/templates/pdp/registry";

vi.mock("next/dynamic", () => ({
	default: () => () => null,
}));

const product: ProductView = {
	id: "p1",
	slug: "tee",
	name: "Tee",
	category: null,
	descriptionHtml: ["<p>Soft</p>"],
	attributes: [{ name: "Material", value: "Cotton" }],
	careInstructions: null,
	images: [],
	priceRange: null,
	isAvailable: true,
	isBestseller: false,
	variantCount: 1,
	seoTitle: null,
	seoDescription: null,
	extensions: {},
};

function slot(id: string) {
	return createElement("div", { id });
}

describe("PDP templates", () => {
	it("pins the contract version", () => {
		expect(STOREFRONT_CONTRACT_VERSION).toBe(1);
	});

	it("selects a registered template whose gallery matches ACTIVE_PDP_GALLERY", () => {
		expect(PDP_TEMPLATES[ACTIVE_PDP_TEMPLATE]).toBe(templates.pdp);
		expect(templates.pdp.gallery).toBe(ACTIVE_PDP_GALLERY);
	});

	it("places the gallery and buy box slots once", () => {
		const html = renderToStaticMarkup(
			createElement(templates.pdp.Layout, {
				product,
				slots: {
					gallery: slot("pdp-slot-gallery"),
					buyBox: slot("pdp-slot-buybox"),
					breadcrumbs: slot("pdp-slot-breadcrumbs"),
					attributes: slot("pdp-slot-attributes"),
				},
			}),
		);

		for (const id of ["pdp-slot-gallery", "pdp-slot-buybox", "pdp-slot-breadcrumbs", "pdp-slot-attributes"]) {
			expect(html.match(new RegExp(`id="${id}"`, "g"))).toHaveLength(1);
		}
		expect(html).toContain("Tee");
		expect(html).toContain("container-super-wide");
	});
});
