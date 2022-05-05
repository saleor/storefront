import { CheckoutLineFragment, OrderLineFragment } from "@/graphql";
import React from "react";
import { Text } from "@/components/Text";
import { SummaryItemMoneySection } from "./SummaryItemMoneySection";
import { SummaryItemMoneyEditableSection } from "./SummaryItemMoneyEditableSection";
import { SummaryItemDelete } from "./SummaryItemDelete";
import { PhotoIcon } from "@/icons";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { isCheckoutLine } from "./utils";

interface LineItemProps {
  line: CheckoutLineFragment | OrderLineFragment;
}

export const SummaryItem: React.FC<LineItemProps> = ({ line }) => {
  const readOnly = !isCheckoutLine(line);
  const { variantName, productName, productImage } = !readOnly
    ? {
        variantName: line.variant.name,
        productName: line.variant.product.name,
        productImage: line.variant.media?.find(({ type }) => type === "IMAGE"),
      }
    : {
        variantName: line.variantName,
        productName: line.productName,
        productImage: line.thumbnail,
      };

  const formatMessage = useFormattedMessages();

  return (
    <li className="flex flex-row px-6 mb-6">
      <div className="relative flex flex-row">
        {!readOnly && <SummaryItemDelete line={line} />}
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
            ariaLabel={formatMessage("itemNameLabel")}
            className="mb-2"
          >
            {productName}
          </Text>
          <Text ariaLabel={formatMessage("variantNameLabel")}>
            {variantName}
          </Text>
        </div>
        {readOnly ? (
          <SummaryItemMoneySection line={line} />
        ) : (
          <SummaryItemMoneyEditableSection line={line} />
        )}
      </div>
    </li>
  );
};
