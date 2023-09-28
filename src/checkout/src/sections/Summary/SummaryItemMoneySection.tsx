import { summaryMessages } from "./messages";
import { type OrderLineFragment } from "@/checkout/src/graphql";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";
import { SummaryItemMoneyInfo } from "@/checkout/src/sections/Summary/SummaryItemMoneyInfo";

interface LineItemQuantitySelectorProps {
	line: OrderLineFragment;
}

export const SummaryItemMoneySection: React.FC<LineItemQuantitySelectorProps> = ({ line }) => {
	const formatMessage = useFormattedMessages();

	return (
		<div className="flex flex-col items-end">
			<p>{`${formatMessage(summaryMessages.quantity)}: ${line.quantity}`}</p>
			<SummaryItemMoneyInfo {...line} undiscountedUnitPrice={line.undiscountedUnitPrice.gross} />
		</div>
	);
};
