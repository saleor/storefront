import { IconButton } from "@/checkout/components/IconButton";
import React from "react";
import { CloseIcon as DeleteIcon } from "@/checkout/icons";
import {
  CheckoutLineFragment,
  useCheckoutLineDeleteMutation,
} from "@/checkout/graphql";
import { useFormattedMessages } from "@/checkout/hooks/useFormattedMessages";
import { useCheckout } from "@/checkout/hooks/useCheckout";

interface LineItemDeleteProps {
  line: CheckoutLineFragment;
}

export const SummaryItemDelete: React.FC<LineItemDeleteProps> = ({
  line: { id: lineId },
}) => {
  const formatMessage = useFormattedMessages();
  const [, deleteLine] = useCheckoutLineDeleteMutation();
  const { checkout } = useCheckout();

  const handleLineDelete = () =>
    deleteLine({
      id: checkout.id,
      lineId,
    });

  return (
    <div className="delete-row-button">
      <IconButton
        variant="bare"
        onClick={handleLineDelete}
        ariaLabel={formatMessage("deleteItemLabel")}
        icon={<img src={DeleteIcon} alt="delete icon" />}
      />
    </div>
  );
};
