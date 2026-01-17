import { type MightNotExist } from "@/checkout/lib/global-types";
import { localeConfig } from "@/config/locale";

export type Money = {
	currency: string;
	amount: number;
} | null;

/**
 * Format money using Intl.NumberFormat with proper currency symbol.
 * Returns empty string for null/undefined input.
 */
export const getFormattedMoney = <TMoney extends Money>(money: MightNotExist<TMoney>, negative = false) => {
	if (!money) {
		return "";
	}

	const { amount, currency } = money;

	return new Intl.NumberFormat(localeConfig.default, {
		style: "currency",
		currency,
		currencyDisplay: "symbol",
	}).format(negative ? -amount : amount);
};

/**
 * Format shipping price - returns "Free" for zero amount.
 */
export const formatShippingPrice = <TMoney extends Money>(money: MightNotExist<TMoney>): string => {
	if (!money) {
		return "—";
	}
	if (money.amount === 0) {
		return "Free";
	}
	return getFormattedMoney(money);
};

/**
 * Format money with fallback for display (returns "—" for null/undefined).
 */
export const formatMoneyWithFallback = <TMoney extends Money>(money: MightNotExist<TMoney>): string => {
	if (!money) {
		return "—";
	}
	return getFormattedMoney(money);
};
