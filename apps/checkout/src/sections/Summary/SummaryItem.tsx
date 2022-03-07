import { CheckoutLine } from "@graphql";
import React from "react";
import { Text } from "@components/Text";
import { SummaryItemMoneySection } from "./SummaryItemMoneySection";
import { SummaryItemDelete } from "./SummaryItemDelete";
import { PhotoIcon } from "@icons";
import { useFormattedMessages } from "@hooks/useFormattedMessages";

interface LineItemProps {
  line: CheckoutLine;
}

export const SummaryItem: React.FC<LineItemProps> = ({ line }) => {
  const {
    variant: {
      name: variantName,
      product: { name: productName },
      media,
    },
  } = line;

  const formatMessage = useFormattedMessages();

  const productImage = media?.find(({ type }) => type === "IMAGE");

  return (
    <li className="flex flex-row px-6 mb-6">
      <div className="relative flex flex-row">
        <SummaryItemDelete line={line} />
        <div className="summary-item-image mr-4 z-1">
          {productImage ? (
            <img
              className="object-contain"
              alt={productImage?.alt}
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
            bold
            ariaLabel={formatMessage("itemNameLabel")}
            className="mb-2"
          >
            {productName}
          </Text>
          <Text ariaLabel={formatMessage("variantNameLabel")}>
            {variantName}
          </Text>
        </div>
        <SummaryItemMoneySection line={line} />
      </div>
    </li>
  );
};
