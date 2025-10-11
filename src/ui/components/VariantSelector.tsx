import { clsx } from "clsx";
import { redirect } from "next/navigation";
import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { type ProductListItemFragment, type VariantDetailsFragment } from "@/gql/graphql";
import { getHrefForVariant } from "@/lib/utils";

export function VariantSelector({
	variants,
	product,
	selectedVariant,
	channel,
}: {
	variants: readonly VariantDetailsFragment[];
	product: ProductListItemFragment;
	selectedVariant?: VariantDetailsFragment;
	channel: string;
}) {
	if (!selectedVariant && variants.length === 1 && variants[0]?.quantityAvailable) {
		redirect("/" + channel + getHrefForVariant({ productSlug: product.slug, variantId: variants[0].id }));
	}

	return (
		variants.length > 1 && (
			<fieldset className="my-6" role="radiogroup" data-testid="VariantSelector">
				<legend className="label mb-3">Select Variant</legend>
				<div className="flex flex-wrap gap-3">
					{variants.map((variant) => {
						const isDisabled = !variant.quantityAvailable;
						const isCurrentVariant = selectedVariant?.id === variant.id;
						return (
							<LinkWithChannel
								key={variant.id}
								prefetch={true}
								scroll={false}
								href={
									isDisabled ? "#" : getHrefForVariant({ productSlug: product.slug, variantId: variant.id })
								}
								className={clsx(
									isCurrentVariant
										? "border-accent-400 bg-accent-900 text-white hover:bg-accent-800"
										: "border-base-700 bg-base-950 text-base-100 hover:border-base-600 hover:bg-base-900",
									"relative flex min-w-[5ch] items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap border-2 px-4 py-2.5 text-center text-sm font-medium tracking-wide transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-accent-400 focus-within:ring-offset-2 focus-within:ring-offset-black aria-disabled:cursor-not-allowed aria-disabled:bg-base-900 aria-disabled:text-base-500 aria-disabled:opacity-50",
									isDisabled && "pointer-events-none",
								)}
								role="radio"
								tabIndex={isDisabled ? -1 : undefined}
								aria-checked={isCurrentVariant}
								aria-disabled={isDisabled}
							>
								{variant.name}
							</LinkWithChannel>
						);
					})}
				</div>
			</fieldset>
		)
	);
}
