import React from "react";
import { type ClassNames, Text } from "@/checkout/ui-kit";
import { Money } from "@/checkout/src/components";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { type Money as MoneyType } from "@/checkout/src/graphql";
import clsx from "clsx";
import { getFormattedMoney } from "@/checkout/src/lib/utils/money";
import { type GrossMoney } from "@/checkout/src/lib/globalTypes";
import { summaryLabels, summaryMessages } from "./messages";

interface SummaryItemMoneyInfoProps {
  classNames?: ClassNames<"container">;
  unitPrice: GrossMoney;
  undiscountedUnitPrice: MoneyType;
  quantity: number;
}

export const SummaryItemMoneyInfo: React.FC<SummaryItemMoneyInfoProps> = ({
  unitPrice,
  quantity,
  undiscountedUnitPrice,
  classNames = {},
}) => {
  const formatMessage = useFormattedMessages();
  const multiplePieces = quantity > 1;
  const piecePrice = unitPrice.gross;
  const onSale = undiscountedUnitPrice.amount !== unitPrice.gross.amount;

  return (
    <>
      <div className={clsx("flex flex-row", classNames.container)}>
        {onSale && (
          <Money
            ariaLabel={formatMessage(summaryLabels.undiscountedPrice)}
            money={{
              currency: undiscountedUnitPrice.currency,
              amount: undiscountedUnitPrice.amount * quantity,
            }}
            className="line-through mr-1"
          />
        )}
        <Money
          ariaLabel={formatMessage(summaryLabels.totalPrice)}
          money={{
            currency: piecePrice?.currency,
            amount: (piecePrice?.amount || 0) * quantity,
          }}
          weight="bold"
          className={clsx({
            "!text-text-error": onSale,
          })}
        />
      </div>

      {multiplePieces && (
        <Text
          aria-label={formatMessage(summaryLabels.singlePiecePrice)}
          size="sm"
          color="secondary"
          className="ml-4"
        >
          {`${getFormattedMoney(piecePrice)} ${formatMessage(summaryMessages.each)}`}
        </Text>
      )}
    </>
  );
};
