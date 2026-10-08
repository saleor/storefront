import { ACTIVE_PLP_FACETS, ACTIVE_PLP_TEMPLATE } from "@/config/template-selection";
import type { PlpTemplate } from "@/lib/storefront/templates";
import { barPlp } from "@/templates/plp/bar";
import { sidebarPlp } from "@/templates/plp/sidebar";

/**
 * Fork-owned PLP registry. Add a template here, then point
 * `ACTIVE_PLP_TEMPLATE` at it in `src/config/template-selection.ts`.
 */
export const PLP_TEMPLATES = {
	bar: barPlp,
	sidebar: sidebarPlp,
} as const satisfies Record<string, PlpTemplate>;

const activeId: keyof typeof PLP_TEMPLATES = ACTIVE_PLP_TEMPLATE;

/**
 * Compile-time selection check. A type error on this line means `ACTIVE_PLP_FACETS`
 * is not the active template's `facets`. Set both in src/config/template-selection.ts.
 */
const activeFacets: (typeof PLP_TEMPLATES)[typeof ACTIVE_PLP_TEMPLATE]["facets"] = ACTIVE_PLP_FACETS;

export function activePlpTemplate(): PlpTemplate {
	const template = PLP_TEMPLATES[activeId];
	if (template.facets !== activeFacets) {
		throw new Error(
			`ACTIVE_PLP_TEMPLATE "${activeId}" uses facets "${template.facets}", but ACTIVE_PLP_FACETS is "${ACTIVE_PLP_FACETS}". Set both in src/config/template-selection.ts.`,
		);
	}
	return template;
}
