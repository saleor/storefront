import { activePdpTemplate } from "@/templates/pdp/registry";

export { ACTIVE_PDP_GALLERY, ACTIVE_PDP_TEMPLATE } from "@/config/template-selection";
export { PDP_TEMPLATES } from "@/templates/pdp/registry";

/** The shop's templates. Routes read this; they do not import a template file directly. */
export const templates = {
	pdp: activePdpTemplate(),
};
