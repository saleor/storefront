import { Text } from "@saleor/ui-kit";
import { OrderLineFragment } from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { SummaryItemMoneyInfo } from "@/checkout-storefront/sections/Summary/SummaryItemMoneyInfo";
import { summaryMessages } from "./messages";

interface LineItemQuantitySelectorProps {
  line: OrderLineFragment;
}

export const SummaryItemMoneySection: React.FC<LineItemQuantitySelectorProps> = ({ line }) => {
  const formatMessage = useFormattedMessages();

  return (
    <div className="flex flex-col items-end">
      <Text>{`${formatMessage(summaryMessages.quantity)}: ${line.quantity}`}</Text>
      <SummaryItemMoneyInfo {...line} undiscountedUnitPrice={line.undiscountedUnitPrice.gross} />
    </div>
  );
};
