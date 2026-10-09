import { activePdpTemplate } from "@/templates/pdp/registry";
import { activePlpTemplate } from "@/templates/plp/registry";
import { assertListingProviders } from "@/lib/listing/registry";

export {
	ACTIVE_PDP_GALLERY,
	ACTIVE_PDP_TEMPLATE,
	ACTIVE_PLP_FACETS,
	ACTIVE_PLP_TEMPLATE,
} from "@/config/template-selection";
export { PDP_TEMPLATES } from "@/templates/pdp/registry";
export { PLP_TEMPLATES } from "@/templates/plp/registry";

assertListingProviders();

/** The shop's templates. Routes read this; they do not import a template file directly. */
export const templates = {
	pdp: activePdpTemplate(),
	plp: activePlpTemplate(),
};
