"use client";

import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { type ProductDetailsQuery, type VariantDetailsFragment } from "@/gql/graphql";
import { getHrefForVariant, formatMoney } from "@/lib/utils";

type Product = NonNullable<ProductDetailsQuery["product"]>;

export interface VariantSelectorProps {
	variants: readonly VariantDetailsFragment[];
	product: Product;
	selectedVariant?: VariantDetailsFragment;
	channel: string;
	onVariantChange?: (variant: VariantDetailsFragment) => void;
}

export function VariantSelector({
	variants,
	product,
	selectedVariant,
	channel,
	onVariantChange,
}: VariantSelectorProps) {
	const router = useRouter();

	// Group variants by attribute type
	const attributeGroups = getAttributeGroups(variants);

	const handleVariantSelect = (variant: VariantDetailsFragment) => {
		if (onVariantChange) {
			onVariantChange(variant);
		}
		const href = "/" + channel + getHrefForVariant({ productSlug: product.slug, variantId: variant.id });
		router.push(href, { scroll: false });
	};

	// Auto-select single available variant
	if (!selectedVariant && variants.length === 1 && variants[0]?.quantityAvailable) {
		const href = "/" + channel + getHrefForVariant({ productSlug: product.slug, variantId: variants[0].id });
		router.push(href, { scroll: false });
	}

	if (variants.length <= 1) {
		return null;
	}

	// If we have attribute groups, render grouped selectors
	if (Object.keys(attributeGroups).length > 0) {
		return (
			<div className="space-y-6" data-testid="VariantSelector">
				{Object.entries(attributeGroups).map(([attributeName, values]) => (
					<div key={attributeName}>
						<label className="block text-sm font-medium text-secondary-900 mb-3">
							{attributeName}
							{selectedVariant && (
								<span className="ml-2 text-secondary-500 font-normal">
									{getSelectedAttributeValue(selectedVariant, attributeName)}
								</span>
							)}
						</label>
						<div className="flex flex-wrap gap-2">
							{values.map((value) => {
								const matchingVariant = findVariantByAttribute(variants, attributeName, value);
								const isDisabled = !matchingVariant?.quantityAvailable;
								const isSelected = selectedVariant && 
									getSelectedAttributeValue(selectedVariant, attributeName) === value;

								return (
									<button
										key={value}
										type="button"
										onClick={() => matchingVariant && !isDisabled && handleVariantSelect(matchingVariant)}
										disabled={isDisabled}
										className={clsx(
											"relative min-w-[3rem] px-4 py-2 text-sm font-medium rounded-md border transition-all",
											isSelected
												? "border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-600"
												: isDisabled
													? "border-secondary-200 bg-secondary-50 text-secondary-400 cursor-not-allowed"
													: "border-secondary-300 bg-white text-secondary-700 hover:border-primary-400 hover:bg-primary-50"
										)}
										aria-pressed={isSelected}
										aria-disabled={isDisabled}
									>
										{value}
										{isDisabled && (
											<span className="absolute inset-0 flex items-center justify-center">
												<span className="w-full h-px bg-secondary-400 rotate-[-20deg]" />
											</span>
										)}
									</button>
								);
							})}
						</div>
					</div>
				))}
			</div>
		);
	}

	// Fallback to simple variant list
	return (
		<fieldset className="my-4" role="radiogroup" data-testid="VariantSelector">
			<legend className="block text-sm font-medium text-secondary-900 mb-3">
				Select Option
			</legend>
			<div className="flex flex-wrap gap-2">
				{variants.map((variant) => {
					const isDisabled = !variant.quantityAvailable;
					const isCurrentVariant = selectedVariant?.id === variant.id;
					const price = variant.pricing?.price?.gross;

					return (
						<button
							key={variant.id}
							type="button"
							onClick={() => !isDisabled && handleVariantSelect(variant)}
							disabled={isDisabled}
							className={clsx(
								"relative flex flex-col items-center justify-center min-w-[5rem] px-4 py-3 text-sm rounded-md border transition-all",
								isCurrentVariant
									? "border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-600"
									: isDisabled
										? "border-secondary-200 bg-secondary-50 text-secondary-400 cursor-not-allowed"
										: "border-secondary-300 bg-white text-secondary-700 hover:border-primary-400 hover:bg-primary-50"
							)}
							role="radio"
							aria-checked={isCurrentVariant}
							aria-disabled={isDisabled}
						>
							<span className="font-medium">{variant.name}</span>
							{price && (
								<span className={clsx(
									"text-xs mt-1",
									isCurrentVariant ? "text-primary-600" : "text-secondary-500"
								)}>
									{formatMoney(price.amount, price.currency)}
								</span>
							)}
							{isDisabled && (
								<span className="absolute inset-0 flex items-center justify-center">
									<span className="w-full h-px bg-secondary-400 rotate-[-20deg]" />
								</span>
							)}
						</button>
					);
				})}
			</div>
		</fieldset>
	);
}

// Helper functions
function getAttributeGroups(variants: readonly VariantDetailsFragment[]): Record<string, string[]> {
	const groups: Record<string, Set<string>> = {};

	variants.forEach((variant) => {
		variant.attributes?.forEach((attr) => {
			const name = attr.attribute.name;
			if (name) {
				if (!groups[name]) {
					groups[name] = new Set();
				}
				attr.values.forEach((val) => {
					if (val.name) {
						groups[name].add(val.name);
					}
				});
			}
		});
	});

	const result: Record<string, string[]> = {};
	Object.entries(groups).forEach(([key, values]) => {
		result[key] = Array.from(values);
	});

	return result;
}

function getSelectedAttributeValue(variant: VariantDetailsFragment, attributeName: string): string | undefined {
	const attr = variant.attributes?.find((a) => a.attribute.name === attributeName);
	return attr?.values[0]?.name ?? undefined;
}

function findVariantByAttribute(
	variants: readonly VariantDetailsFragment[],
	attributeName: string,
	value: string
): VariantDetailsFragment | undefined {
	return variants.find((variant) => {
		const attr = variant.attributes?.find((a) => a.attribute.name === attributeName);
		return attr?.values.some((v) => v.name === value);
	});
}
