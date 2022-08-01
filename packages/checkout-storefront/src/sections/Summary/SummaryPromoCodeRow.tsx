import { IconButton } from "@/checkout-storefront/components/IconButton";
import React from "react";
import { SummaryMoneyRow, SummaryMoneyRowProps } from "./SummaryMoneyRow";
import { RemoveIcon } from "@/checkout-storefront/icons";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";
import { useCheckoutRemovePromoCodeMutation } from "@/checkout-storefront/graphql";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";

interface SummaryPromoCodeRowProps extends SummaryMoneyRowProps {
  promoCode?: string;
  promoCodeId?: string;
}

export const SummaryPromoCodeRow: React.FC<SummaryPromoCodeRowProps> = ({
  promoCode,
  promoCodeId,
  ...rest
}) => {
  const { checkout } = useCheckout();
  const formatMessage = useFormattedMessages();
  const [, checkoutRemovePromoCode] = useCheckoutRemovePromoCodeMutation();

  const onDelete = () => {
    const variables = promoCode
      ? { promoCode: promoCode as string }
      : { promoCodeId: promoCodeId as string };

    void checkoutRemovePromoCode({
      checkoutId: checkout.id,
      ...variables,
    });
  };

  return (
    <SummaryMoneyRow {...rest}>
      <IconButton
        color="secondary"
        onClick={onDelete}
        ariaLabel={formatMessage("removePromoCodeLabel")}
        variant="bare"
        icon={<img src={getSvgSrc(RemoveIcon)} />}
      />
    </SummaryMoneyRow>
  );
};
