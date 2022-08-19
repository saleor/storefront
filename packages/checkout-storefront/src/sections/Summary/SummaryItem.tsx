import { CheckoutLineFragment, OrderLineFragment } from "@/checkout-storefront/graphql";
import React, { PropsWithChildren } from "react";
import { Text } from "@saleor/ui-kit";
import { PhotoIcon } from "@/checkout-storefront/icons";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getSummaryLineProps } from "./utils";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { compact } from "lodash-es";

interface LineItemProps {
  line: CheckoutLineFragment | OrderLineFragment;
}

export const SummaryItem: React.FC<PropsWithChildren<LineItemProps>> = ({ line, children }) => {
  const { productName, productImage } = getSummaryLineProps(line);

  const formatMessage = useFormattedMessages();
  const attributesText =
    compact(
      line.variant?.attributes.reduce(
        (result: Array<string | undefined | null>, { values }) => [
          ...result,
          ...values.map(({ name }) => name),
        ],
        []
      )
    ).join(", ") || "";

  return (
    <li className="summary-item">
      <div className="relative flex flex-row">
        <div className="summary-item-image mr-4 z-1">
          {productImage ? (
            <img
              className="object-contain"
              alt={productImage?.alt || undefined}
              src={productImage?.url}
            />
          ) : (
            <img className="object-cover" alt="product placeholder" src={getSvgSrc(PhotoIcon)} />
          )}
        </div>
      </div>
      <div className="summary-row w-full items-start">
        <div className="flex flex-col">
          <Text weight="bold" aria-label={formatMessage("itemNameLabel")} className="mb-3">
            {productName}
          </Text>
          <Text size="xs" aria-label={formatMessage("variantNameLabel")} className="max-w-38">
            {attributesText}
          </Text>
        </div>
        {children}
      </div>
    </li>
  );
};
