import React, { type PropsWithChildren } from "react";
import { Money, type MoneyProps } from "@/checkout/components/Money";

export interface SummaryMoneyRowProps extends MoneyProps {
	label: string;
}

export const SummaryMoneyRow: React.FC<PropsWithChildren<SummaryMoneyRowProps>> = ({
	label,
	children,
	...moneyProps
}) => {
	return (
		<div className="mb-2 flex flex-row items-center justify-between">
			<div className="flex flex-row items-center">
				<p color="secondary">{label}</p>
				{children}
			</div>
			<Money {...moneyProps} />
		</div>
	);
};
