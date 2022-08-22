import { Text } from "@saleor/ui-kit";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SummaryItem } from "./SummaryItem";
import { OrderFragment } from "@/checkout-storefront/graphql";
import { Divider } from "@/checkout-storefront/components/Divider";
import { Money } from "@/checkout-storefront/components/Money";

export const FinalizedSummary = ({ order }: { order: OrderFragment }) => {
  const formatMessage = useFormattedMessages();

  const totalPrice = order.total.gross;
  const taxCost = order.total.tax;

  return (
    <div className="summary w-[594px]">
      <div className="summary-title open">
        <div className="flex flex-row items-center">
          <Text size="lg" weight="bold">
            {formatMessage("summary")}
          </Text>
        </div>
      </div>

      <div className="w-full h-12" />
      <ul className="summary-items">
        {order.lines.map((line) => (
          <SummaryItem key={line.id} line={line} />
        ))}
      </ul>
      <div className="summary-recap">
        <div className="summary-row">
          <Text weight="bold">{formatMessage("subtotal")}</Text>
          <Money
            ariaLabel={formatMessage("subtotalLabel")}
            weight="bold"
            money={order.subtotal.gross}
          />
        </div>
        <Divider className="my-4" />
        <div className="summary-row mb-2">
          <Text color="secondary">{formatMessage("shippingCost")}</Text>
          <Money
            ariaLabel={formatMessage("shippingCostLabel")}
            color="secondary"
            money={order.shippingPrice.gross}
          />
        </div>
        <div className="summary-row">
          <Money ariaLabel={formatMessage("taxCostLabel")} color="secondary" money={taxCost} />
        </div>
        <Divider className="my-4" />
        <div className="summary-row">
          <Text size="md" weight="bold">
            {formatMessage("total")}
          </Text>
          <Money ariaLabel={formatMessage("totalLabel")} weight="bold" money={totalPrice} />
        </div>
      </div>
    </div>
  );
};
