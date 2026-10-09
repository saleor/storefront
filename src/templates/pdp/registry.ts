import { ACTIVE_PDP_GALLERY, ACTIVE_PDP_TEMPLATE } from "@/config/template-selection";
import type { PdpTemplate } from "@/lib/storefront/templates";
import { columnsPdp } from "@/templates/pdp/columns";
import { immersivePdp } from "@/templates/pdp/immersive";
import { mosaicPdp } from "@/templates/pdp/mosaic";
import { standardPdp } from "@/templates/pdp/standard";

/**
 * Fork-owned PDP registry. Add a template here, then point
 * `ACTIVE_PDP_TEMPLATE` at it in `src/config/template-selection.ts`.
 */
export const PDP_TEMPLATES = {
	immersive: immersivePdp,
	standard: standardPdp,
	mosaic: mosaicPdp,
	columns: columnsPdp,
} as const satisfies Record<string, PdpTemplate>;

const activeId: keyof typeof PDP_TEMPLATES = ACTIVE_PDP_TEMPLATE;

export function activePdpTemplate(): PdpTemplate {
	const template = PDP_TEMPLATES[activeId];
	// The template's own classes and the gallery island read different constants.
	// A mismatch renders the columns shell with the immersive filmstrip.
	if (template.gallery !== ACTIVE_PDP_GALLERY) {
		throw new Error(
			`ACTIVE_PDP_TEMPLATE "${activeId}" uses gallery "${template.gallery}", but ACTIVE_PDP_GALLERY is "${ACTIVE_PDP_GALLERY}". Set both in src/config/template-selection.ts.`,
		);
	}
	return template;
}
