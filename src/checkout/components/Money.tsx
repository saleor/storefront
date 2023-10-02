import { type Money as MoneyType, getFormattedMoney } from "@/checkout/lib/utils/money";

import { type AriaLabel, type Classes } from "@/checkout/lib/globalTypes";

export interface MoneyProps<TMoney extends MoneyType = MoneyType> extends Classes, AriaLabel {
	money?: TMoney;
	negative?: boolean;
}

export const Money = <TMoney extends MoneyType>({
	money,
	className,
	ariaLabel,
	negative,
	...textProps
}: MoneyProps<TMoney>) => {
	const formattedMoney = getFormattedMoney(money, negative);

	if (!money) {
		return null;
	}

	return (
		<p {...textProps} aria-label={ariaLabel} className={className}>
			{formattedMoney}
		</p>
	);
};
