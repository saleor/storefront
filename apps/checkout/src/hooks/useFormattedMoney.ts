import { useNumberFormatter } from "@react-aria/i18n";

export interface Money {
  currency: string;
  amount: number;
}

export const useFormattedMoney = <TMoney extends Money>(
  money: TMoney | undefined
) => {
  if (!money) return "";

  const formatter = useNumberFormatter({
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: 2,
  });

  return formatter.format(money.amount);
};

export const getFormattedMoney = <TMoney extends Money>(
  money: TMoney | undefined
) => {
  if (!money) {
    return "";
  }

  const { amount, currency } = money;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(amount);
};
