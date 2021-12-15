export const formatAsMoney = (amount: number = 0, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    style: "currency",
    currency,
  }).format(amount);

// Returns true for non nullable values
export function notNullable<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}
