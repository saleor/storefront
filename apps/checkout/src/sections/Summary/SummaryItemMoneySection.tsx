import { IconButton } from "@/components/IconButton";
import { MinusIcon, PlusIcon } from "@/icons";
import { Text } from "@/components/Text";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckoutLine,
  CheckoutLinesUpdateMutationVariables,
  useCheckoutLinesUpdateMutation,
} from "@/graphql";
import debounce from "lodash/debounce";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { useFormattedMoney } from "@/hooks/useFormattedMoney";
import { Money } from "@/components/Money";
import clsx from "clsx";
import { getDataWithToken } from "@/lib/utils";

interface LineItemQuantitySelectorProps {
  line: CheckoutLine;
}

export const SummaryItemMoneySection: React.FC<
  LineItemQuantitySelectorProps
> = ({ line }) => {
  const {
    variant: { id: variantId, pricing },
  } = line;

  const [quantity, setQuantity] = useState(line.quantity);
  const previousQuantity = useRef(line.quantity);
  const [{ fetching, data }, updateLines] = useCheckoutLinesUpdateMutation();

  useEffect(() => {
    if (fetching) {
      return;
    }

    const newQuantity = data?.checkoutLinesUpdate?.checkout?.lines?.find(
      (updatedLine) => updatedLine?.id === line.id
    )?.quantity;

    if (!newQuantity) {
      setQuantity(previousQuantity.current);
      return;
    }

    previousQuantity.current = quantity;

    if (quantity !== newQuantity) {
      setQuantity(newQuantity);
    }
  }, [data, fetching, line.id, quantity]);

  const getUpdateLineVars = (
    quantity: number
  ): CheckoutLinesUpdateMutationVariables =>
    getDataWithToken({
      lines: [
        {
          quantity,
          variantId,
        },
      ],
    });

  const handleSubmit = (quantity: number) => {
    updateLines(getUpdateLineVars(quantity));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmit = useCallback(
    debounce((quantity) => handleSubmit(quantity), 250),
    []
  );

  useEffect(() => {
    if (quantity === previousQuantity.current) {
      return;
    }

    debouncedSubmit(quantity);
  }, [quantity, debouncedSubmit]);

  const piecePrice = pricing?.price?.gross;
  const formatMessage = useFormattedMessages();
  const formattedPiecePrice = useFormattedMoney(piecePrice);

  const multiplePieces = quantity > 1;

  return (
    <div className="flex flex-col items-end">
      <div className="flex flex-row mb-3">
        <IconButton
          ariaLabel={formatMessage("addItemQuantityLabel")}
          onClick={() => {
            setQuantity(quantity - 1);
          }}
        >
          <img src={MinusIcon} alt="remove" />
        </IconButton>
        <Text weight="bold" className="mx-3">
          {quantity}
        </Text>
        <IconButton
          ariaLabel={formatMessage("subtractItemQuantityLabel")}
          onClick={() => {
            setQuantity(quantity + 1);
          }}
        >
          <img src={PlusIcon} alt="add" />
        </IconButton>
      </div>
      <div className="flex flex-row justify-end">
        {pricing?.onSale && (
          <Money
            ariaLabel={formatMessage("undiscountedPriceLabel")}
            money={{
              currency: pricing?.priceUndiscounted?.gross.currency as string,
              amount:
                (pricing?.priceUndiscounted?.gross.amount || 0) * quantity,
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
            "text-text-error": pricing?.onSale,
          })}
        />
      </div>
      {multiplePieces && (
        <Text
          ariaLabel={formatMessage("singlePiecePriceLabel")}
          size="sm"
          color="secondary"
          className="ml-4"
        >
          {`${formattedPiecePrice} ${formatMessage("each")}`}
        </Text>
      )}
    </div>
  );
};
