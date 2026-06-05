"use client";

import type { VariantSelectorProps, OptionRenderer } from "./types";
import { defaultRenderers } from "./renderers";

/**
 * A single variant selector for one attribute (e.g., Color or Size).
 *
 * Renders options using the appropriate renderer based on:
 * 1. Explicit `renderer` prop
 * 2. `attributeSlug` for registry lookup
 * 3. `swatchImageUrl` (pill) or `colorHex` (circle swatch)
 * 4. `_default` fallback
 */
export function VariantSelector({
	label,
	options,
	selectedId,
	attributeSlug,
	onSelect,
	renderer: explicitRenderer,
	renderers,
	unavailableMessage,
	isPending,
}: VariantSelectorProps) {
	const registry = { ...defaultRenderers, ...renderers };
	const selectedOption = options.find((opt) => opt.id === selectedId);

	const handleSelect = (optionId: string) => {
		const option = options.find((opt) => opt.id === optionId);
		if (!option?.available) return;
		onSelect(attributeSlug, optionId);
	};

	if (!options.length) return null;

	// Determine which renderer to use for each option
	const getRendererForOption = (option: (typeof options)[number]): OptionRenderer => {
		// 1. Explicit renderer prop takes precedence
		if (explicitRenderer) return explicitRenderer;

		// 2. Image swatches → pill; hex swatches → circle
		if (option.swatchImageUrl && registry._imageSwatch) {
			return registry._imageSwatch;
		}
		if (option.colorHex && registry._color) {
			return registry._color;
		}

		// 3. Try attribute slug
		const slugRenderer = attributeSlug ? registry[attributeSlug] : undefined;
		if (slugRenderer) {
			return slugRenderer;
		}

		// 4. Fallback to default
		return registry._default ?? defaultRenderers._default!;
	};

	// Group options by renderer for better layout
	const swatchOptions = options.filter((opt) => opt.colorHex || opt.swatchImageUrl);
	const textOptions = options.filter((opt) => !opt.colorHex && !opt.swatchImageUrl);

	const labelId = `variant-label-${attributeSlug}`;

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span id={labelId} className="text-sm font-medium">
					{label}
				</span>
				{unavailableMessage ? (
					<span className="text-sm text-muted-foreground" role="status">
						{unavailableMessage}
					</span>
				) : selectedOption ? (
					<span className="text-sm text-muted-foreground">{selectedOption.name}</span>
				) : null}
			</div>

			{/* Swatch row (image pills and/or color circles) */}
			{swatchOptions.length > 0 && (
				<div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-4">
					{swatchOptions.map((option) => {
						const Renderer = getRendererForOption(option);
						return (
							<Renderer
								key={option.id}
								option={option}
								isSelected={selectedId === option.id}
								onSelect={handleSelect}
								isPending={isPending}
							/>
						);
					})}
				</div>
			)}

			{/* Text/Size buttons row */}
			{textOptions.length > 0 && (
				<div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-4">
					{textOptions.map((option) => {
						const Renderer = getRendererForOption(option);
						return (
							<Renderer
								key={option.id}
								option={option}
								isSelected={selectedId === option.id}
								onSelect={handleSelect}
								isPending={isPending}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
