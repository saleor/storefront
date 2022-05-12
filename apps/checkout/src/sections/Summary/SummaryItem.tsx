import { CheckoutLineFragment, OrderLineFragment } from "@/graphql";
import React from "react";
import { Text } from "@saleor/ui-kit";
import { SummaryItemMoneySection } from "./SummaryItemMoneySection";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { SummaryItemDelete } from "./SummaryItemDelete";
import { PhotoIcon } from "@/icons";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { getSummaryLineProps, isCheckoutLine } from "./utils";

interface LineItemProps {
  line: CheckoutLineFragment | OrderLineFragment;
}

export const SummaryItem: React.FC<LineItemProps> = ({ line }) => {
  const readOnly = !isCheckoutLine(line);
  const { variantName, productName, productImage } = getSummaryLineProps(line);

  const formatMessage = useFormattedMessages();

  return (
    <li className="flex flex-row px-6 mb-6">
      <div className="relative flex flex-row">
        {!readOnly && <SummaryItemDelete line={line as CheckoutLineFragment} />}
        <div className="summary-item-image mr-4 z-1">
          {productImage ? (
            <img
              className="object-contain"
              alt={productImage?.alt || undefined}
              src={productImage?.url}
            />
          ) : (
            <img
              className="object-cover"
              alt="product placeholder"
              src={PhotoIcon}
            />
          )}
        </div>
      </div>
      <div className="summary-row w-full">
        <div className="flex flex-col">
          <Text
            weight="bold"
            aria-label={formatMessage("itemNameLabel")}
            className="mb-2"
          >
            {productName}
          </Text>
          <Text aria-label={formatMessage("variantNameLabel")}>
            {variantName}
          </Text>
        </div>
        {readOnly ? (
          <SummaryItemMoneySection line={line as OrderLineFragment} />
        ) : (
          <SummaryItemMoneyEditableSection
            line={line as CheckoutLineFragment}
          />
        )}
      </div>
    </li>
  );
};
