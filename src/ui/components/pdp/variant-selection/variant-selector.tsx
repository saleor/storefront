"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { VariantSelectorProps, OptionRenderer } from "./types";
import { defaultRenderers } from "./renderers";
import { resolveVariantGroupControl } from "./resolve-group-control";

const controlSkeleton = (
	<div className="h-12 w-full max-w-md animate-pulse rounded-lg bg-muted" aria-hidden />
);

/**
 * Select + combobox are lazy-loaded so the common chips path does not pay for
 * Radix Select, cmdk, Popover, or Sheet.
 */
const VariantSelectControl = dynamic(
	() => import("./variant-select-control").then((mod) => mod.VariantSelectControl),
	{ ssr: false, loading: () => controlSkeleton },
);

const VariantComboboxControl = dynamic(
	() => import("./variant-combobox-control").then((mod) => mod.VariantComboboxControl),
	{ ssr: false, loading: () => controlSkeleton },
);

/**
 * A single variant selector for one attribute (e.g., Color or Size).
 *
 * Control ladder (per group):
 * 1. Chips / swatches — small option counts (existing renderers)
 * 2. shadcn Select — mid-size text/numeric lists (lazy chunk)
 * 3. Searchable combobox — large lists / large swatch sets (lazy chunk)
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
	const t = useTranslations("pdp.variant");
	const registry = { ...defaultRenderers, ...renderers };
	const selectedOption = options.find((opt) => opt.id === selectedId);
	const control = resolveVariantGroupControl(options);

	const handleSelect = (optionId: string) => {
		const option = options.find((opt) => opt.id === optionId);
		if (!option || !option.available) return;
		onSelect(attributeSlug, optionId);
	};

	if (!options.length) return null;

	const getRendererForOption = (option: (typeof options)[number]): OptionRenderer => {
		if (explicitRenderer) return explicitRenderer;
		if (option.swatchImageUrl && registry._imageSwatch) {
			return registry._imageSwatch;
		}
		if (option.colorHex && registry._color) {
			return registry._color;
		}
		const slugRenderer = attributeSlug ? registry[attributeSlug] : undefined;
		if (slugRenderer) {
			return slugRenderer;
		}
		return registry._default ?? defaultRenderers._default!;
	};

	const swatchOptions = options.filter((opt) => opt.colorHex || opt.swatchImageUrl);
	const textOptions = options.filter((opt) => !opt.colorHex && !opt.swatchImageUrl);
	const labelId = `variant-label-${attributeSlug}`;
	const placeholder = t("chooseOption", { label });
	const searchPlaceholder = t("searchOptions", { label });
	const noResultsLabel = t("noMatchingOptions");

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

			{control === "select" ? (
				<VariantSelectControl
					label={label}
					attributeSlug={attributeSlug}
					options={options}
					selectedId={selectedId}
					onSelect={handleSelect}
					isPending={isPending}
					labelId={labelId}
					placeholder={placeholder}
				/>
			) : control === "combobox" ? (
				<VariantComboboxControl
					label={label}
					attributeSlug={attributeSlug}
					options={options}
					selectedId={selectedId}
					onSelect={handleSelect}
					isPending={isPending}
					labelId={labelId}
					placeholder={placeholder}
					searchPlaceholder={searchPlaceholder}
					noResultsLabel={noResultsLabel}
				/>
			) : (
				<>
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
				</>
			)}
		</div>
	);
}
