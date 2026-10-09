import type { PlpTemplateProps } from "@/lib/storefront/templates";

/** Shared chrome for the built-in PLP presets. Facet placement lives on the results island. */
export function PlpPresetLayout({ surface, slots }: PlpTemplateProps) {
	return (
		<div className="flex min-h-screen flex-col bg-background" data-plp-preset={surface.kind}>
			{slots.header}
			{slots.results}
			{slots.empty}
		</div>
	);
}
