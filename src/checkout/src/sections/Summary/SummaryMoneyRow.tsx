import React, { type PropsWithChildren } from "react";
import { Text } from "@/checkout/ui-kit";
import { Money, type MoneyProps } from "@/checkout/src/components/Money";

export interface SummaryMoneyRowProps extends MoneyProps {
	label: string;
}

export const SummaryMoneyRow: React.FC<PropsWithChildren<SummaryMoneyRowProps>> = ({
	label,
	children,
	...moneyProps
}) => {
	return (
		<div className="summary-row mb-2">
			<div className="flex flex-row items-center">
				<Text color="secondary">{label}</Text>
				{children}
			</div>
			<Money {...moneyProps} color="secondary" />
		</div>
	);
};
