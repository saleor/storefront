import type { CheckoutFindQuery } from "@/gql/graphql";
import { pickTranslatedName } from "@/lib/saleor-translations";
import {
	getAttributeValueDisplayName,
	type SaleorVariantAttribute,
} from "@/ui/components/pdp/variant-selection/utils";

type CheckoutFindResult = NonNullable<CheckoutFindQuery["checkout"]>;
type CheckoutLine = CheckoutFindResult["lines"][number];
type CheckoutVariant = CheckoutLine["variant"];

type CartDrawerAttribute = {
	attribute: {
		name?: string | null;
		slug?: string | null;
		inputType?: string | null;
	};
	values: Array<{
		name?: string | null;
		value?: string | null;
		file?: { url?: string | null } | null;
	}>;
};

export type CartCheckoutLine = CheckoutLine & {
	variant: CheckoutVariant & {
		attributes: CartDrawerAttribute[];
	};
};

export type CartCheckout = Omit<CheckoutFindResult, "lines"> & {
	lines: CartCheckoutLine[];
};

function mapAttributesForCartDrawer(attributes: SaleorVariantAttribute[]): CartDrawerAttribute[] {
	return attributes.map((attr) => ({
		attribute: {
			name: pickTranslatedName({
				name: attr.attribute.name ?? attr.attribute.slug ?? "",
				translation: attr.attribute.translation,
			}),
			slug: attr.attribute.slug,
			inputType: attr.attribute.inputType,
		},
		values: attr.values.map((value) => ({
			name: getAttributeValueDisplayName(value),
			value: value.value,
			file: value.file,
		})),
	}));
}

function translateCartVariant(variant: CheckoutVariant): CartCheckoutLine["variant"] {
	const selectionAttributes = (variant.selectionAttributes ?? []) as SaleorVariantAttribute[];
	const nonSelectionAttributes = (variant.nonSelectionAttributes ?? []) as SaleorVariantAttribute[];

	return {
		...variant,
		name: pickTranslatedName({ name: variant.name, translation: variant.translation }),
		attributes: mapAttributesForCartDrawer([...selectionAttributes, ...nonSelectionAttributes]),
		product: {
			...variant.product,
			name: pickTranslatedName({
				name: variant.product.name,
				translation: variant.product.translation,
			}),
			category: variant.product.category
				? {
						...variant.product.category,
						name: pickTranslatedName({
							name: variant.product.category.name,
							translation: variant.product.category.translation,
						}),
					}
				: variant.product.category,
		},
	};
}

/** Apply Saleor translations to cart drawer / cart page checkout snapshots. */
export function withTranslatedCartCheckout(checkout: CheckoutFindResult): CartCheckout {
	return {
		...checkout,
		lines: checkout.lines.map((line) => ({
			...line,
			variant: translateCartVariant(line.variant),
		})),
	};
}
