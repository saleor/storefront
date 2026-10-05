import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ACTIVE_PLP_FACETS, ACTIVE_PLP_TEMPLATE } from "@/config/template-selection";
import { templates } from "@/config/templates";
import type { PlpSurfaceView } from "@/lib/storefront/templates";
import { PLP_TEMPLATES } from "@/templates/plp/registry";

const surface: PlpSurfaceView = {
	kind: "category",
	title: "Hoodies",
	description: "Warm",
};

function slot(id: string) {
	return createElement("div", { id });
}

describe("PLP templates", () => {
	it("selects a registered template whose facets match ACTIVE_PLP_FACETS", () => {
		expect(PLP_TEMPLATES[ACTIVE_PLP_TEMPLATE]).toBe(templates.plp);
		expect(templates.plp.facets).toBe(ACTIVE_PLP_FACETS);
	});

	it("places header, results, and empty once", () => {
		for (const template of Object.values(PLP_TEMPLATES)) {
			const html = renderToStaticMarkup(
				createElement(template.Layout, {
					surface,
					slots: {
						header: slot("plp-slot-header"),
						results: slot("plp-slot-results"),
						empty: slot("plp-slot-empty"),
					},
				}),
			);
			for (const id of ["plp-slot-header", "plp-slot-results", "plp-slot-empty"]) {
				expect(html.match(new RegExp(`id="${id}"`, "g")), template.id).toHaveLength(1);
			}
			expect(html, template.id).toContain("bg-background");
		}
	});
});
