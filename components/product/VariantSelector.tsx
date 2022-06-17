import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { usePaths } from "@/lib/paths";
import { translate } from "@/lib/translations";
import { ProductDetailsFragment } from "@/saleor/api";

import { useRegions } from "../RegionsProvider";

export interface VariantSelectorProps {
  product: ProductDetailsFragment;
  selectedVariantID?: string;
}

export function VariantSelector({ product, selectedVariantID }: VariantSelectorProps) {
  const paths = usePaths();
  const router = useRouter();
  const { formatPrice } = useRegions();

  const [selectedVariant, setSelectedVariant] = useState(selectedVariantID);

  const { variants } = product;

  // Skip displaying selector when theres less than 2 variants
  if (!variants || variants.length === 1) {
    return null;
  }

  const onChange = (value: string) => {
    setSelectedVariant(value);
    router.replace(
      paths.products._slug(product.slug).$url({ ...(value && { query: { variant: value } }) }),
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  return (
    <div className="w-full">
      <RadioGroup value={selectedVariant} onChange={onChange}>
        <div className="space-y-4">
          {variants.map((variant) => (
            <RadioGroup.Option
              key={variant.id}
              value={variant.id}
              className={({ checked }) =>
                clsx("bg-main w-full", checked && "bg-brand", !checked && "")
              }
            >
              {({ checked }) => (
                <div
                  className={clsx(
                    "bg-white w-full h-full relative hover:translate-y-[-10px] hover:translate-x-[-10px]  transition-transform object-contain border-2",
                    checked && "border-brand translate-y-[-10px] translate-x-[-10px]",
                    !checked && "hover:border-main border-main-2"
                  )}
                >
                  <RadioGroup.Label as="div" className="w-full justify-between p-4">
                    <div className="flex flex-row gap-2 w-full font-semibold text-md">
                      <div className="grow">{translate(variant, "name")}</div>
                      <div>{formatPrice(variant.pricing?.price?.gross)}</div>
                    </div>
                  </RadioGroup.Label>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}

export default VariantSelector;
