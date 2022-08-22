import React from "react";
import { ClassNames, Text } from "@saleor/ui-kit";
import { Money } from "@/checkout-storefront/components";
import { useFormattedMessages } from "@/checkout-storefront/hooks";
import { Money as MoneyType } from "@/checkout-storefront/graphql";
import clsx from "clsx";
import { getFormattedMoney } from "@/checkout-storefront/lib/utils";
import { GrossMoney } from "@/checkout-storefront/lib/globalTypes";

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
            ariaLabel={formatMessage("undiscountedPriceLabel")}
            money={{
              currency: undiscountedUnitPrice.currency,
              amount: undiscountedUnitPrice.amount * quantity,
            }}
            className="line-through mr-1"
          />
        )}
        <Money
          ariaLabel={formatMessage("totalPriceLabel")}
          money={{
            currency: piecePrice?.currency as string,
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
          aria-label={formatMessage("singlePiecePriceLabel")}
          size="sm"
          color="secondary"
          className="ml-4"
        >
          {`${getFormattedMoney(piecePrice)} ${formatMessage("each")}`}
        </Text>
      )}
    </>
  );
};
