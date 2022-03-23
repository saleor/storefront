import { IconButton } from "@components/IconButton";
import React from "react";
import { CloseIcon as DeleteIcon } from "@icons";
import { CheckoutLine, useCheckoutLineDeleteMutation } from "@graphql";
import { getDataWithToken } from "@lib/utils";

interface LineItemDeleteProps {
  line: CheckoutLine;
}

export const SummaryItemDelete: React.FC<LineItemDeleteProps> = ({
  line: { id: lineId },
}) => {
  const [, deleteLine] = useCheckoutLineDeleteMutation();

  const handleLineDelete = () =>
    deleteLine(
      getDataWithToken({
        lineId,
      })
    );

  return (
    <div className="delete-row-button">
      <IconButton onClick={handleLineDelete} ariaLabel="delete item">
        <img src={DeleteIcon} alt="delete icon" />
      </IconButton>
    </div>
  );
};
