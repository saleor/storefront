import React, { type PropsWithChildren } from "react";
import { useSummaryLineLineAttributesText, getSummaryLineProps } from "./utils";
import { summaryLabels } from "./messages";
import { type CheckoutLineFragment, type OrderLineFragment } from "@/checkout/src/graphql";
import { Text } from "@/checkout/ui-kit";
import { PhotoIcon } from "@/checkout/ui-kit/icons";
import { useFormattedMessages } from "@/checkout/src/hooks/useFormattedMessages";

export type SummaryLine = CheckoutLineFragment | OrderLineFragment;

interface LineItemProps {
	line: SummaryLine;
}

export const SummaryItem: React.FC<PropsWithChildren<LineItemProps>> = ({ line, children }) => {
	const { productName, productImage } = getSummaryLineProps(line);

	const formatMessage = useFormattedMessages();

	const attributesText = useSummaryLineLineAttributesText(line);

	return (
		<li className="summary-item">
			<div className="relative flex flex-row">
				<div className="summary-item-image z-1 mr-4">
					{productImage ? (
						<img className="object-contain" alt={productImage?.alt || undefined} src={productImage?.url} />
					) : (
						<PhotoIcon />
					)}
				</div>
			</div>
			<div className="summary-row w-full items-start">
				<div className="flex flex-col">
					<Text weight="bold" aria-label={formatMessage(summaryLabels.summaryItemName)} className="mb-3">
						{productName}
					</Text>
					<Text size="xs" aria-label={formatMessage(summaryLabels.variantName)} className="max-w-38">
						{attributesText}
					</Text>
				</div>
				{children}
			</div>
		</li>
	);
};
