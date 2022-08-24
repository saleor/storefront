import { NextRouter } from "next/router";

import {
  ProductDetailsFragment,
  ProductVariantDetailsFragment,
  SelectedAttributeDetailsFragment,
} from "@/saleor/api";
/**
 * When a variant is selected, the variant attributes are shown together with
 * the attributes of the product. Otherwise, only the product
 * attributes are shown
 * @param   product  The product object
 * @param   selectedVariant   The selected variant object
 * @return  The attributes that will be shown to the user for the chosen product
 */

export const getProductAttributes = (
  product: ProductDetailsFragment,
  selectedVariant?: ProductVariantDetailsFragment
): SelectedAttributeDetailsFragment[] => {
  if (selectedVariant) return product.attributes.concat(selectedVariant.attributes);
  return product.attributes;
};

export const getSelectedVariantID = (product: ProductDetailsFragment, router?: NextRouter) => {
  // Check, if variant is already in the url
  const urlVariant =
    typeof window !== "undefined" && router ? router.query.variant?.toString() : undefined;
  if (!!urlVariant && product.variants?.find((p) => p?.id === urlVariant)) {
    // case, where url contain valid variant id
    return urlVariant;
  }
  if (product?.variants?.length === 1) {
    // case, where product has only one variant to choose from, so we pre-select it
    return product.variants[0]!.id;
  }
  // there are multiple variants and user has not chosen any
  return undefined;
};
