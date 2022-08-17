export type Money = {
  currency: string;
  amount: number;
} | null;

export const getFormattedMoney = <TMoney extends Money>(
  money: TMoney | undefined | null,
  negative: boolean = false
) => {
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
