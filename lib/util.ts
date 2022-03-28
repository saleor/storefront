import { DEFAULT_LOCALE } from "@/lib/regions";

export const formatAsMoney = (amount = 0, currency = "USD", locale = DEFAULT_LOCALE) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

// Returns true for non nullable values
export function notNullable<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}
