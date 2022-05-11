import { Text } from "@saleor/ui-kit";
import { OrderLineFragment } from "@/graphql";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";
import { useFormattedMoney } from "@/hooks/useFormattedMoney";
import { Money } from "@/components/Money";
import clsx from "clsx";

interface LineItemQuantitySelectorProps {
  line: OrderLineFragment;
}

export const SummaryItemMoneySection: React.FC<
  LineItemQuantitySelectorProps
> = ({ line }) => {
  const onSale =
    line.undiscountedUnitPrice.gross.amount !== line.unitPrice.gross.amount;
  const piecePrice = line.unitPrice.gross;
  const formatMessage = useFormattedMessages();
  const formattedPiecePrice = useFormattedMoney(piecePrice);

  const multiplePieces = line.quantity > 1;

  return (
    <div className="flex flex-col items-end">
      <div className="flex flex-row justify-end">
        {onSale && (
          <Money
            ariaLabel={formatMessage("undiscountedPriceLabel")}
            money={{
              currency: line.undiscountedUnitPrice.gross.currency as string,
              amount:
                (line.undiscountedUnitPrice.gross.amount || 0) * line.quantity,
            }}
            className="line-through mr-1"
          />
        )}
        <Money
          ariaLabel={formatMessage("totalPriceLabel")}
          money={{
            currency: piecePrice?.currency as string,
            amount: (piecePrice?.amount || 0) * line.quantity,
          }}
          weight="bold"
          className={clsx({
            "text-text-error": onSale,
          })}
        />
      </div>
      <Text>
        qty: <b>{line.quantity}</b>
      </Text>
      {multiplePieces && (
        <Text
          aria-label={formatMessage("singlePiecePriceLabel")}
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
