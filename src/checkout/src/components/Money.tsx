import clsx from "clsx";
import { Text, type TextProps } from "@/checkout/ui-kit";
import { type Money as MoneyType, getFormattedMoney } from "@/checkout/src/lib/utils/money";

import { type AriaLabel, type Classes } from "@/checkout/src/lib/globalTypes";

export interface MoneyProps<TMoney extends MoneyType = MoneyType>
  extends TextProps,
    Classes,
    AriaLabel {
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
    <Text {...textProps} aria-label={ariaLabel} className={clsx("money", className)}>
      {formattedMoney}
    </Text>
  );
};
