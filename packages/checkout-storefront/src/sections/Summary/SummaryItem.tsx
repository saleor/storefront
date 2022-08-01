import { CheckoutLineFragment, OrderLineFragment } from "@/checkout-storefront/graphql";
import React from "react";
import { Text } from "@saleor/ui-kit";
import { SummaryItemMoneySection } from "./SummaryItemMoneySection";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { PhotoIcon } from "@/checkout-storefront/icons";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getSummaryLineProps, isCheckoutLine } from "./utils";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";

interface LineItemProps {
  line: CheckoutLineFragment | OrderLineFragment;
}

export const SummaryItem: React.FC<LineItemProps> = ({ line }) => {
  const readOnly = !isCheckoutLine(line);
  const { productName, productImage } = getSummaryLineProps(line);

  const formatMessage = useFormattedMessages();
  const attributesText =
    (
      line.variant?.attributes.reduce(
        (result: string[], { values }) =>
          [...result, ...values.map(({ name }) => name)] as string[],
        []
      ) as string[]
    ).join(", ") || "";

  return (
    <li className="flex flex-row mb-6">
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
      <div className="summary-row w-full">
        <div className="flex flex-col">
          <Text
            weight="bold"
            aria-label={formatMessage("itemNameLabel")}
            className="mb-3"
          >
            {productName}
          </Text>
          <Text
            size="xs"
            aria-label={formatMessage("variantNameLabel")}
            className="max-w-38"
          >
            {attributesText}
          </Text>
        </div>
        {readOnly ? (
          <SummaryItemMoneySection line={line as OrderLineFragment} />
        ) : (
          <SummaryItemMoneyEditableSection line={line as CheckoutLineFragment} />
        )}
      </div>
    </li>
  );
};
