import clsx from "clsx";
import { Text, TextProps } from "./Text";
import {
  Money as MoneyType,
  useFormattedMoney,
} from "@hooks/useFormattedMoney";

export interface MoneyProps<TMoney extends MoneyType> extends TextProps {
  money?: TMoney;
  className?: string;
}

export const Money = <TMoney extends MoneyType>({
  money,
  className,
  ...textProps
}: MoneyProps<TMoney>) => {
  const formattedMoney = useFormattedMoney(money);

  if (!money) {
    return null;
  }

  return (
    <Text {...textProps} className={clsx("money", className)}>
      {formattedMoney}
    </Text>
  );
};
