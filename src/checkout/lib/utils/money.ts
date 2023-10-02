import { type MightNotExist } from "@/checkout/lib/globalTypes";

export type Money = {
	currency: string;
	amount: number;
} | null;

export const getFormattedMoney = <TMoney extends Money>(money: MightNotExist<TMoney>, negative = false) => {
	if (!money) {
		return "";
	}

	const { amount, currency } = money;

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		currencyDisplay: "symbol",
	}).format(negative ? -amount : amount);
};
