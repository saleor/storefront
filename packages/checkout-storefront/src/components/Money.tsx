import clsx from "clsx";
import { Text, TextProps } from "@saleor/ui-kit";
import {
  Money as MoneyType,
  useFormattedMoney,
} from "@/checkout-storefront/hooks/useFormattedMoney";
import { AriaLabel, Classes } from "@/checkout-storefront/lib/globalTypes";

export interface MoneyProps<TMoney extends MoneyType>
  extends TextProps,
    Classes,
    AriaLabel {
  money?: TMoney;
}

export const Money = <TMoney extends MoneyType>({
  money,
  className,
  ariaLabel,
  ...textProps
}: MoneyProps<TMoney>) => {
  const formattedMoney = useFormattedMoney(money);

  if (!money) {
    return null;
  }

  return (
    <Text
      {...textProps}
      aria-label={ariaLabel}
      className={clsx("money", className)}
    >
      {formattedMoney}
    </Text>
  );
};
