import { useRouter } from "next/router";
import React, { useState } from "react";

import { usePaths } from "@/lib/paths";
import { translate } from "@/lib/translations";
import { notNullable } from "@/lib/util";
import { ProductDetailsFragment } from "@/saleor/api";

export interface VariantSelectorProps {
  product: ProductDetailsFragment;
  selectedVariantID?: string;
}

export const VariantSelector = ({
  product,
  selectedVariantID,
}: VariantSelectorProps) => {
  const paths = usePaths();
  const router = useRouter();

  const [value, setValue] = useState(selectedVariantID);

  const variants = product.variants;

  // Skip displaying selector when theres less than 2 variants
  if (!variants || variants.length === 1) {
    return null;
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target;
    setValue(target.value);
    let query = {};
    if (target.value !== "None") {
      query = { variant: target.value };
    }
    router.replace(
      paths.products._slug(product.slug).$url({ query }),
      undefined,
      { shallow: true }
    );
  };

  return (
    <select onChange={onChange} value={value} className="w-full">
      <option key="None" value="None">
        -
      </option>
      {variants.map((variant) => {
        if (!notNullable(variant)) {
          return null;
        }
        return (
          <option key={variant.id} value={variant.id}>
            {translate(variant, "name")}
          </option>
        );
      })}
    </select>
  );
};

export default VariantSelector;
