import { IconButton } from "@/components/IconButton";
import React from "react";
import { CloseIcon as DeleteIcon } from "@/icons";
import { CheckoutLineFragment, useCheckoutLineDeleteMutation } from "@/graphql";
import { getDataWithToken } from "@/lib/utils";
import { useFormattedMessages } from "@/hooks/useFormattedMessages";

interface LineItemDeleteProps {
  line: CheckoutLineFragment;
}

export const SummaryItemDelete: React.FC<LineItemDeleteProps> = ({
  line: { id: lineId },
}) => {
  const formatMessage = useFormattedMessages();
  const [, deleteLine] = useCheckoutLineDeleteMutation();

  const handleLineDelete = () =>
    deleteLine(
      getDataWithToken({
        lineId,
      })
    );

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
