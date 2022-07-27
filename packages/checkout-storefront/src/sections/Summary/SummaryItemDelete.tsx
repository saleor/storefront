import { IconButton } from "@/checkout-storefront/components/IconButton";
import React from "react";
import { CloseIcon as DeleteIcon } from "@/checkout-storefront/icons";
import { CheckoutLineFragment, useCheckoutLineDeleteMutation } from "@/checkout-storefront/graphql";
import { useFormattedMessages } from "@/checkout-storefront/hooks/useFormattedMessages";
import { useCheckout } from "@/checkout-storefront/hooks/useCheckout";
import { getSvgSrc } from "@/checkout-storefront/lib/svgSrc";

interface LineItemDeleteProps {
  line: CheckoutLineFragment;
}

export const SummaryItemDelete: React.FC<LineItemDeleteProps> = ({ line: { id: lineId } }) => {
  const formatMessage = useFormattedMessages();
  const [, deleteLine] = useCheckoutLineDeleteMutation();
  const { checkout } = useCheckout();

  const handleLineDelete = () =>
    deleteLine({
      checkoutId: checkout.id,
      lineId,
    });

  return (
    <div className="delete-row-button">
      <IconButton
        variant="bare"
        onClick={() => {
          void handleLineDelete();
        }}
        ariaLabel={formatMessage("deleteItemLabel")}
        icon={<img src={getSvgSrc(DeleteIcon)} alt="delete icon" />}
      />
    </div>
  );
};
