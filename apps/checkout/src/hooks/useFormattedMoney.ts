import { useNumberFormatter } from "@react-aria/i18n";

export interface Money {
  currency: string;
  amount: number;
}

export const useFormattedMoney = <TMoney extends Money>(
  money: TMoney | undefined
) => {
  const formatter = useNumberFormatter({
    style: "currency",
    currency: money?.currency,
    minimumFractionDigits: 2,
  });

  return money ? formatter.format(money.amount) : "";
};
