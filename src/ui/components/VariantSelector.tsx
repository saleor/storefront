import { clsx } from "clsx";
import Link from "next/link";
import { redirect } from "next/navigation";
import { type ProductListItemFragment, type VariantDetailsFragment } from "@/gql/graphql";

export function VariantSelector({
	variants,
	product,
	selectedVariant,
}: {
	variants: readonly VariantDetailsFragment[];
	product: ProductListItemFragment;
	selectedVariant?: VariantDetailsFragment;
}) {
	if (!selectedVariant && variants.length === 1 && variants[0]?.quantityAvailable) {
		redirect(getHrefForVariant(product, variants[0]));
	}

	return (
		<fieldset className="my-4" role="radiogroup" data-testid="VariantSelector">
			<legend className="sr-only">Variants</legend>
			<div className="flex flex-wrap gap-3">
				{variants.length > 1 &&
					variants.map((variant) => {
						const isDisabled = !variant.quantityAvailable;
						const isCurrentVariant = selectedVariant?.id === variant.id;
						return (
							<Link
								key={variant.id}
								prefetch={true}
								href={isDisabled ? "#" : getHrefForVariant(product, variant)}
								className={clsx(
									isCurrentVariant
										? "border-transparent bg-neutral-900 text-white hover:bg-neutral-800"
										: "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100",
									"relative flex min-w-[8ch] items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap rounded border p-3 text-center text-sm font-semibold focus-within:outline focus-within:outline-2 aria-disabled:cursor-not-allowed aria-disabled:bg-neutral-100 aria-disabled:opacity-50",
									isDisabled && "pointer-events-none",
								)}
								role="radio"
								tabIndex={isDisabled ? -1 : undefined}
								aria-checked={isCurrentVariant}
								aria-disabled={isDisabled}
							>
								{variant.name}
							</Link>
						);
					})}
			</div>
		</fieldset>
	);
}

function getHrefForVariant(product: ProductListItemFragment, variant: VariantDetailsFragment): string {
	const pathname = `/products/${encodeURIComponent(product.slug)}`;
	const query = new URLSearchParams({ variant: variant.id });
	return `${pathname}?${query.toString()}`;
}
