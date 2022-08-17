import clsx from "clsx";
import { Text, TextProps } from "@saleor/ui-kit";
import { Money as MoneyType, getFormattedMoney } from "@/checkout-storefront/lib/utils";

import { AriaLabel, Classes } from "@/checkout-storefront/lib/globalTypes";

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
