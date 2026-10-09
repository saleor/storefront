import { localeConfig } from "@/config/locale";

/**
 * Format price with currency. Pass a BCP 47 `locale` to localize grouping/symbol placement;
 * defaults to the base locale for backward compatibility.
 */
export function formatPrice(amount: number, currency: string, locale: string = localeConfig.default): string {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency,
	}).format(amount);
}
