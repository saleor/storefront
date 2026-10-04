import { ACTIVE_PDP_TEMPLATE } from "@/config/template-selection";
import type { PdpTemplate } from "@/lib/storefront/templates";
import { immersivePdp } from "@/templates/pdp/immersive";

/**
 * Fork-owned PDP registry. Add a template here, then point
 * `ACTIVE_PDP_TEMPLATE` at it in `src/config/template-selection.ts`.
 */
export const PDP_TEMPLATES = {
	immersive: immersivePdp,
} as const satisfies Record<string, PdpTemplate>;

const activeId: keyof typeof PDP_TEMPLATES = ACTIVE_PDP_TEMPLATE;

export function activePdpTemplate(): PdpTemplate {
	return PDP_TEMPLATES[activeId];
}
