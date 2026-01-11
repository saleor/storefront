"use client";

import type { VariantSelectorProps, OptionRenderer } from "./types";
import { defaultRenderers } from "./renderers";

/**
 * A single variant selector for one attribute (e.g., Color or Size).
 *
 * Renders options using the appropriate renderer based on:
 * 1. Explicit `renderer` prop
 * 2. `attributeSlug` for registry lookup
 * 3. `colorHex` presence (uses `_color` renderer)
 * 4. `_default` fallback
 */
export function VariantSelector({
	label,
	options,
	selectedId,
	attributeSlug,
	onSelect,
	renderer: explicitRenderer,
	unavailableMessage,
}: VariantSelectorProps) {
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

		// 2. If option has colorHex, use color swatch
		if (option.colorHex && defaultRenderers._color) {
			return defaultRenderers._color;
		}

		// 3. Try attribute slug
		if (attributeSlug && attributeSlug in defaultRenderers) {
			return defaultRenderers[attributeSlug];
		}

		// 4. Fallback to default
		return defaultRenderers._default;
	};

	// Group options by renderer for better layout
	const colorOptions = options.filter((opt) => opt.colorHex);
	const textOptions = options.filter((opt) => !opt.colorHex);

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium">{label}</span>
				{unavailableMessage ? (
					<span className="text-sm text-muted-foreground">{unavailableMessage}</span>
				) : selectedOption ? (
					<span className="text-sm text-muted-foreground">{selectedOption.name}</span>
				) : null}
			</div>

			{/* Color swatches row */}
			{colorOptions.length > 0 && (
				<div className="flex flex-wrap gap-4">
					{colorOptions.map((option) => {
						const Renderer = getRendererForOption(option);
						return (
							<Renderer
								key={option.id}
								option={option}
								isSelected={selectedId === option.id}
								onSelect={handleSelect}
							/>
						);
					})}
				</div>
			)}

			{/* Text/Size buttons row */}
			{textOptions.length > 0 && (
				<div className="flex flex-wrap gap-4">
					{textOptions.map((option) => {
						const Renderer = getRendererForOption(option);
						return (
							<Renderer
								key={option.id}
								option={option}
								isSelected={selectedId === option.id}
								onSelect={handleSelect}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
